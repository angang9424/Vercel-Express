const postgre = require('../database');

const itemController = {
	getAll: async(req, res) => {
		try {
			const { rows } = await postgre.query(`
				SELECT i.*, b.qty AS stock_qty
				FROM item AS i
				LEFT JOIN bin AS b ON b.item_id = i.id
			`);
			res.json({msg: "OK", data: rows});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	itemCatGetAll: async(req, res) => {
		try {
			const { rows } = await postgre.query("SELECT id AS value, name AS label FROM item_category");
			res.json({msg: "OK", data: rows});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	itemPriceGetAll: async(req, res) => {
		try {
			const { rows } = await postgre.query("SELECT * FROM item_price");
			res.json({msg: "OK", data: rows});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	itemPriceByItemID: async(req, res) => {
		try {
			const { date, party_id, price_type } = req.body;

			const sql = `SELECT *
						FROM item_price
						WHERE item_id = $1
						AND valid_from <= $2
						AND party_id = $3
						AND price_type = $4
						AND modified IS NOT NULL
						ORDER BY modified DESC
						LIMIT 1`;

			const { rows } = await postgre.query(sql, [req.params.id, req.query.date, req.query.party_id, req.query.price_type]);
			
			res.json({msg: "OK", data: rows[0]});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	getName: async(req, res) => {
		try {
			const { rows } = await postgre.query("select name from item");
			res.json({msg: "OK", data: rows});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	getById: async(req, res) => {
		try {
			const { rows } = await postgre.query("select * from item where id = $1", [req.params.id]);

			if (rows[0]) {
				return res.json({msg: "OK", data: rows});
			}

			res.status(404).json({msg: "not found"});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	create: async(req, res) => {
		try {
			const { name, item_category, default_account, created_modified_by, modified } = req.body;

			const sql = 'INSERT INTO item(name, category, default_account, created_by, modified_by, modified) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';

			const { rows } = await postgre.query(sql, [name, item_category, default_account, created_modified_by, created_modified_by, modified]);

			const bin_sql = 'INSERT INTO bin(item_id, item_name, created_by, modified_by, modified) VALUES($1, $2, $3, $4, $5) RETURNING *';

			await postgre.query(bin_sql, [rows[0].id, name, created_modified_by, created_modified_by, modified]);

			// if (rows[0]) {
			// 	req.body = {id: rows[0].id, item_name: name, created_modified_by: created_modified_by, modified: modified};
			// 	await binController.create(req, res);
			// }

			res.json({msg: "OK", data: rows[0]});
		} catch (error) {
			console.log(error)
			res.json({msg: error.msg});
		}
	},
	itemCatCreate: async(req, res) => {
		try {
			const { name, created_modified_by, modified } = req.body;

			const sql = 'INSERT INTO item_category(name, created_by, modified_by, modified) VALUES($1, $2, $3, $4) RETURNING *';

			const { rows } = await postgre.query(sql, [name, created_modified_by, created_modified_by, modified]);

			// if (rows[0]) {
			// 	req.body = {id: rows[0].id, item_name: name, created_modified_by: created_modified_by, modified: modified};
			// 	await binController.create(req, res);
			// }

			res.json({msg: "OK", data: rows[0]});
		} catch (error) {
			console.log(error)
			res.json({msg: error.msg});
		}
	},
	updateById: async(req, res) => {
		try {
			const { name, item_category, modified } = req.body;

			const sql = 'UPDATE item set name = $1, category = $2, modified = $3 where id = $4 RETURNING *';

			const { rows } = await postgre.query(sql, [name, item_category, modified, req.params.id]);

			res.json({msg: "OK", data: rows[0]});
		} catch (error) {
			res.json({msg: error.msg})
		}
	},
	deleteById: async(req, res) => {
		try {
			const sql = 'DELETE FROM item where id = $1 RETURNING *';

			const { rows } = await postgre.query(sql, [req.params.id]);

			const bin_sql = 'DELETE FROM bin where item_id = $1 RETURNING *';

			await postgre.query(bin_sql, [req.params.id]);

			if (rows[0]) {
				return res.json({msg: "OK", data: rows[0]});
			}

			return res.status(404).json({msg: "not found"});
		} catch (error) {
			res.json({msg: error.msg})
		}
	}
}

module.exports = itemController;