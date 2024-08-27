const postgre = require('../database');

const bookController = {
	getAll: async(req, res) => {
		try {
			const { rows } = await postgre.query("SELECT books.*, bin.qty AS stock_qty FROM books INNER JOIN bin ON bin.item_id = books.book_id");
			res.json({msg: "OK", data: rows});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	test: async(req, res) => {
		try {
			res.status(200).json({msg: "not found"});
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
			const { name, price, category, created_modified_by, modified } = req.body;

			const sql = 'INSERT INTO books(name, price, category, created_by, modified_by, modified) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';

			const { rows } = await postgre.query(sql, [name, price, category, created_modified_by, created_modified_by, modified]);

			const bin_sql = 'INSERT INTO bin(item_id, item_name, created_by, modified_by, modified) VALUES($1, $2, $3, $4, $5) RETURNING *';

			await postgre.query(bin_sql, [rows[0].book_id, name, created_modified_by, created_modified_by, modified]);

			// if (rows[0]) {
			// 	req.body = {item_id: rows[0].book_id, item_name: name, created_modified_by: created_modified_by, modified: modified};
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

			const sql = 'UPDATE books set name = $1, price = $2, modified = $3 where book_id = $4 RETURNING *';

			const { rows } = await postgre.query(sql, [name, price, modified, req.params.id]);

			res.json({msg: "OK", data: rows[0]});
		} catch (error) {
			res.json({msg: error.msg})
		}
	},
	deleteById: async(req, res) => {
		try {
			const sql = 'DELETE FROM books where book_id = $1 RETURNING *';

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

module.exports = bookController;