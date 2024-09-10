const postgre = require('../database');

const itemController = {
	getAll: async(req, res) => {
		try {
			const { rows } = await postgre.query(`
				SELECT i.*, b.qty AS stock_qty, ic.name AS item_category
				FROM item AS i
				INNER JOIN bin AS b ON b.item_id = i.id
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
	test: async(req, res) => {
		const client = await postgre.connect();
		const utcDateTime = new Date().toISOString();
		const utcDateConvertToLocal = new Date(utcDateTime);

		try {
			await client.query('BEGIN');

			const { item, qty } = req.body;

			const bin_sql = 'UPDATE bin set qty = qty - $1, modified_by = $2, modified = $3 where item_id = $4 RETURNING *';

			const { rows: binRrows } = await client.query(bin_sql, [qty, 'jang1', utcDateConvertToLocal, item]);

			if (binRrows[0].qty >= 0) {
				await client.query('COMMIT');
			} else {
				await client.query('ROLLBACK');
				return res.status(400).json({msg: "not enough stock"});
			}

			// if (rows[0]) {
			// 	req.body = {id: item, qty: qty, modified_by: created_modified_by, modified: modified};
			// 	await binController.updateById(req, res);
			// }
			return res.json({msg: "OK", data: binRrows[0]});
		} catch (error) {
			await client.query('ROLLBACK');
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
			const { name, rate, item_category, created_modified_by, modified } = req.body;

			const sql = 'INSERT INTO item(name, rate, category, created_by, modified_by, modified) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';

			const { rows } = await postgre.query(sql, [name, rate, item_category, created_modified_by, created_modified_by, modified]);

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
			const { name, price, modified } = req.body;

			const sql = 'UPDATE item set name = $1, price = $2, modified = $3 where id = $4 RETURNING *';

			const { rows } = await postgre.query(sql, [name, price, modified, req.params.id]);

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