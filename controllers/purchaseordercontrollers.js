const postgre = require('../database');

const bookController = {
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
			const { date, total_amount, created_modified_by, modified } = req.body;

			const sql = 'INSERT INTO purchase_order(date, total_amount, created_by, modified_by, modified) VALUES($1, $2, $3, $4, $5) RETURNING *';

			const { rows } = await postgre.query(sql, [date, total_amount, created_modified_by, created_modified_by, modified]);

			res.json({msg: "OK", data: rows[0]});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	createChild: async(req, res) => {
		try {
			const { idx, item, qty, rate, amount, order_id, created_modified_by, modified } = req.body;

			const sql = 'INSERT INTO purchase_order_item(idx, item, qty, rate, amount, order_id, created_by, modified_by, modified) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';

			const { rows } = await postgre.query(sql, [idx, item, qty, rate, amount, order_id, created_modified_by, created_modified_by, modified]);

			res.json({msg: "OK", data: rows[0]});
		} catch (error) {
			res.json({msg: error.msg});
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
	updateById: async(req, res) => {
		try {
			const { name, price, modified } = req.body;

			const sql = 'UPDATE purchase_order set name = $1, price = $2, modified = $3 where book_id = $4 RETURNING *';

			const { rows } = await postgre.query(sql, [name, price, modified, req.params.id]);

			res.json({msg: "OK", data: rows[0]});
		} catch (error) {
			res.json({msg: error.msg})
		}
	},
	deleteById: async(req, res) => {
		try {
			const sql = 'DELETE FROM purchase_order where book_id = $1 RETURNING *';

			const { rows } = await postgre.query(sql, [req.params.id]);

			if (rows[0]) {
				return res.json({msg: "OK", data: rows[0]});
			}

			return res.status(404).json({msg: "not found"});
		} catch (error) {
			res.json({msg: error.msg})
		}
	}
}

module.exports = bookController