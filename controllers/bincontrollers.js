const postgre = require('../database');

const binController = {
	getAll: async(req, res) => {
		try {
			const { rows } = await postgre.query("select * from books");
			res.json({msg: "OK", data: rows});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	getName: async(req, res) => {
		try {
			const { rows } = await postgre.query("select name from books");
			res.json({msg: "OK", data: rows});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	getById: async(req, res) => {
		try {
			const { rows } = await postgre.query("select * from books where book_id = $1", [req.params.id]);

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
			const { item_id, item_name, created_modified_by, modified } = req.body;

			const sql = 'INSERT INTO bin(item_id, item_name, created_by, modified_by, modified) VALUES($1, $2, $3, $4, $5) RETURNING *';

			const { rows } = await postgre.query(sql, [item_id, item_name, created_modified_by, created_modified_by, modified]);

			return {msg: "OK"};
		} catch (error) {
			console.log(error)
			res.json({msg: error.msg});
		}
	},
	updateById: async(req, res) => {
		try {
			const { item_id, qty, modified_by,modified } = req.body;

			const sql = 'UPDATE bin set qty = qty + $1, modified_by = $2, modified = $3 where item_id = $4 RETURNING *';

			const { rows } = await postgre.query(sql, [qty, modified_by, modified, item_id]);

			return {msg: "OK"};
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	deleteById: async(req, res) => {
		try {
			const sql = 'DELETE FROM books where book_id = $1 RETURNING *';

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

module.exports = binController;