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

			const { customer_id, customer_name, date, total_amount, rows, created_modified_by, modified } = req.body;

			const sql = 'INSERT INTO sales_order(customer_id, customer_name, date, total_amount, created_by, modified_by, modified) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';

			const { rows: SORrows } = await client.query(sql, [customer_id, customer_name, date, total_amount, created_modified_by, created_modified_by, modified]);

			for (const row of rows) {
				const child_sql = 'INSERT INTO sales_order_item(idx, item_id, item_name, qty, stock_qty, rate, price_list_rate, amount, order_id, created_by, modified_by, modified) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *';

				await client.query(child_sql, [row.idx, row.item_id, row.item_name, row.qty, row.stock_qty, row.rate, row.price_list_rate, row.amount, SORrows[0].id, created_modified_by, created_modified_by, modified]);

				const bin_sql = 'UPDATE bin set qty = qty - $1, modified_by = $2, modified = $3 where item_id = $4 RETURNING *';

				const { rows: binRows } = await client.query(bin_sql, [row.qty, created_modified_by, modified, row.item_id]);

				if (binRows[0].qty < 0) {
					await client.query('ROLLBACK');
					row.stock_qty = parseInt(binRrows[0].qty) + parseInt(item.qty);
					return res.status(400).json({msg: "not enough stock", data: {rows: rows}});
				}

				if (parseFloat(row.price_list_rate) != parseFloat(row.rate)) {
					const item_price_sql = 'INSERT INTO item_price(item_id, item_name, price_type, party_id, party_name, rate, valid_from, created_by, modified_by, modified) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';
					const { rows: itemPriceRrows } = await postgre.query(item_price_sql, [row.item_id, row.item_name, 'Selling', customer_id, customer_name, row.rate, date, created_modified_by, created_modified_by, modified]);
				}
			}

			await client.query('COMMIT');
			res.json({msg: "OK", data: SORrows[0]});
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

			const { rows: binRows } = await client.query(bin_sql, [qty, created_modified_by, modified, item]);

			if (binRows[0].qty >= 0) {
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
			const { customer_id, customer_name, date, total_amount, modified_by, modified } = req.body;

			const sql = 'UPDATE sales_order set customer_id = $1, customer_name = $2, date = $3, total_amount = $4, modified_by = $5, modified = $6 where id = $7 RETURNING *';

			const { rows } = await postgre.query(sql, [customer_id, customer_name, date, total_amount, modified_by, modified, req.params.id]);

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