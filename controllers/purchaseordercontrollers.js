const postgre = require('../database');

const poController = {
	getAll: async(req, res) => {
		try {
			const { rows } = await postgre.query("select * from purchase_order");
			res.json({msg: "OK", data: rows});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	getName: async(req, res) => {
		try {
			const { rows } = await postgre.query("select name from purchase_order");
			res.json({msg: "OK", data: rows});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	getById: async(req, res) => {
		try {
			const { rows } = await postgre.query("select * from purchase_order where book_id = $1", [req.params.id]);

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
			const { supplier_id, supplier_name, date, total_amount, created_modified_by, modified } = req.body;

			const sql = 'INSERT INTO purchase_order(supplier_id, supplier_name, date, total_amount, created_by, modified_by, modified) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';

			const { rows } = await postgre.query(sql, [supplier_id, supplier_name, date, total_amount, created_modified_by, created_modified_by, modified]);

			res.json({msg: "OK", data: rows[0]});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	createChild: async(req, res) => {
		try {
			const { rows, order_id, created_modified_by, modified } = req.body;

			const sql = 'INSERT INTO purchase_order_item(idx, item_id, item_name, qty, rate, amount, order_id, created_by, modified_by, modified) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';
			const bin_sql = 'UPDATE bin set qty = qty + $1, modified_by = $2, modified = $3 where item_id = $4 RETURNING *';

			for (const row of rows) {
				const { rows: po_item } = await postgre.query(sql, [row.idx, row.item_id, row.item_name, row.qty, row.rate, row.amount, order_id, created_modified_by, created_modified_by, modified]);
				row.id = po_item[0].id;
				const { rows: bin_item } = await postgre.query(bin_sql, [row.qty, created_modified_by, modified, row.item_id]);

				if (!bin_item || bin_item.length === 0) {
					const create_bin_sql = 'INSERT INTO bin(item_id, item_name, qty, created_by, modified_by, modified) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';

					await postgre.query(create_bin_sql, [row.item_id, row.item_name, row.qty, created_modified_by, created_modified_by, modified]);
				}
			}

			res.json({msg: "OK", data: rows});
		} catch (error) {
			res.json({msg: error});
		}
	},
	getPOById: async(req, res) => {
		try {
			const { rows } = await postgre.query("select * from purchase_order where id = $1", [req.params.id]);

			if (rows[0]) {
				return res.json({msg: "OK", data: rows[0]});
			}

			res.status(404).json({msg: "not found"});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	getChildById: async(req, res) => {
		try {
			const { rows } = await postgre.query("select * from purchase_order_item where order_id = $1 ORDER BY idx ASC", [req.params.id]);

			if (rows) {
				return res.json({msg: "OK", data: rows});
			}

			res.status(404).json({msg: "not found"});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	updatePOById: async(req, res) => {
		try {
			const { supplier_id, supplier_name, date, total_amount, modified_by, modified } = req.body;

			const sql = 'UPDATE purchase_order set supplier_id = $1, supplier_name = $2, date = $3, total_amount = $4, modified_by = $5, modified = $6 where id = $7 RETURNING *';

			const { rows } = await postgre.query(sql, [supplier_id, supplier_name, date, total_amount, modified_by, modified, req.params.id]);

			res.json({msg: "OK", data: rows[0]});
		} catch (error) {
			res.json({msg: error.msg})
		}
	},
	updateDeleteChildById: async(req, res) => {
		try {
			const sql = 'DELETE FROM purchase_order_item where order_id = $1 RETURNING *';

			const { rows } = await postgre.query(sql, [req.params.id]);

			for (const row of rows) {
				const bin_sql = 'UPDATE bin set qty = qty - $1, modified_by = $2, modified = $3 where item_id = $4';

				await postgre.query(bin_sql, [row.qty, req.query.modified_by, req.query.modified, row.item]);
			};

			// if (rows[0]) {
			// 	return res.json({msg: "OK", data: rows[0]});
			// }
			return res.json({msg: "OK", data: rows[0]});
			// return res.status(404).json({msg: "not found"});
		} catch (error) {
			return res.json({msg: req.query.modified_by})
		}
	},
	deleteById: async(req, res) => {
		try {
			const sql = 'DELETE FROM purchase_order where id = $1 RETURNING *';

			await postgre.query(sql, [req.params.id]);

			const sql_child = 'DELETE FROM purchase_order_item where order_id = $1 RETURNING *';

			const { rows } = await postgre.query(sql_child, [req.params.id]);

			for (const row of rows) {
				const bin_sql = 'UPDATE bin set qty = qty - $1, modified_by = $2, modified = $3 where item_id = $4';

				await postgre.query(bin_sql, [row.qty, req.query.modified_by, req.query.modified, row.item]);
			};

			if (rows[0]) {
				return res.json({msg: "OK"});
			}

			return res.status(404).json({msg: "not found"});
		} catch (error) {
			res.json({msg: error.msg})
		}
	}
}

module.exports = poController;