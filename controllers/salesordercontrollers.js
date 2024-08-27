const postgre = require('../database');

const soController = {
	getAll: async(req, res) => {
		try {
			const { rows } = await postgre.query("select * from sales_order");
			res.json({msg: "OK", data: rows});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	getName: async(req, res) => {
		try {
			const { rows } = await postgre.query("select name from sales_order");
			res.json({msg: "OK", data: rows});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	getById: async(req, res) => {
		try {
			const { rows } = await postgre.query("select * from sales_order where book_id = $1", [req.params.id]);

			if (rows[0]) {
				return res.json({msg: "OK", data: rows});
			}

			res.status(404).json({msg: "not found"});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	create: async(req, res) => {
		const client = await postgre.connect();

		try {
			await client.query('BEGIN');

			const { date, total_amount, items, created_modified_by, modified } = req.body;

			const sql = 'INSERT INTO sales_order(date, total_amount, created_by, modified_by, modified) VALUES($1, $2, $3, $4, $5) RETURNING *';

			let { rows } = await client.query(sql, [date, total_amount, created_modified_by, created_modified_by, modified]);

			for (const item of items) {
				const child_sql = 'INSERT INTO sales_order_item(idx, item, qty, stock_qty, rate, amount, order_id, created_by, modified_by, modified) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';

				await client.query(child_sql, [item.idx, item.item, item.qty, item.stock_qty, item.rate, item.amount, rows[0].id, created_modified_by, created_modified_by, modified]);

				const bin_sql = 'UPDATE bin set qty = qty - $1, modified_by = $2, modified = $3 where item_id = $4 RETURNING *';

				const { rows: binRrows } = await client.query(bin_sql, [item.qty, created_modified_by, modified, item]);

				if (binRrows[0].qty >= 0) {
					await client.query('COMMIT');
				} else {
					await client.query('ROLLBACK');
					return res.status(400).json({msg: "not enough stock"});
				}
			}

			res.json({msg: "OK", data: rows[0]});
		} catch (error) {
			await client.query('ROLLBACK');
			res.json({msg: error.msg});
		}
	},
	createChild: async(req, res) => {
		const client = await postgre.connect();

		try {
			await client.query('BEGIN');

			const { idx, item, qty, stock_qty, rate, amount, order_id, created_modified_by, modified } = req.body;

			const sql = 'INSERT INTO sales_order_item(idx, item, qty, stock_qty, rate, amount, order_id, created_by, modified_by, modified) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';

			const { rows } = await client.query(sql, [idx, item, qty, stock_qty, rate, amount, order_id, created_modified_by, created_modified_by, modified]);

			const bin_sql = 'UPDATE bin set qty = qty - $1, modified_by = $2, modified = $3 where item_id = $4 RETURNING *';

			const { rows: binRrows } = await client.query(bin_sql, [qty, created_modified_by, modified, item]);

			if (binRrows[0].qty >= 0) {
				await client.query('COMMIT');
			} else {
				await client.query('ROLLBACK');
				return res.status(400).json({msg: "not enough stock"});
			}

			// if (rows[0]) {
			// 	req.body = {item_id: item, qty: qty, modified_by: created_modified_by, modified: modified};
			// 	await binController.updateById(req, res);
			// }
			res.json({msg: "OK", data: rows[0]});
		} catch (error) {
			await client.query('ROLLBACK');
			res.json({msg: error.msg});
		}
	},
	getSOById: async(req, res) => {
		try {
			const { rows } = await postgre.query("select * from sales_order where id = $1", [req.params.id]);

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
			const { rows } = await postgre.query("SELECT * FROM sales_order_item WHERE order_id = $1 ORDER BY idx ASC", [req.params.id]);

			if (rows) {
				return res.json({msg: "OK", data: rows});
			}

			res.status(404).json({msg: "not found"});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	updateSOById: async(req, res) => {
		try {
			const { date, total_amount, modified_by, modified } = req.body;

			const sql = 'UPDATE sales_order set date = $1, total_amount = $2, modified_by = $3, modified = $4 where id = $5 RETURNING *';

			const { rows } = await postgre.query(sql, [date, total_amount, modified_by, modified, req.params.id]);

			res.json({msg: "OK", data: rows[0]});
		} catch (error) {
			res.json({msg: error.msg})
		}
	},
	updateDeleteChildById: async(req, res) => {
		try {
			const sql = 'DELETE FROM sales_order_item where order_id = $1 RETURNING *';

			const { rows } = await postgre.query(sql, [req.params.id]);

			for (const row of rows) {
				const bin_sql = 'UPDATE bin set qty = qty + $1, modified_by = $2, modified = $3 where item_id = $4';

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
			const sql = 'DELETE FROM sales_order where id = $1 RETURNING *';

			await postgre.query(sql, [req.params.id]);

			const sql_child = 'DELETE FROM sales_order_item where order_id = $1 RETURNING *';

			const { rows } = await postgre.query(sql_child, [req.params.id]);

			for (const row of rows) {
				const bin_sql = 'UPDATE bin set qty = qty + $1, modified_by = $2, modified = $3 where item_id = $4';

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

module.exports = soController;