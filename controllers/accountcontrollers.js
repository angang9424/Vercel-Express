const postgre = require('../database');

const accountController = {
	getAll: async(req, res) => {
		try {
			const { rows } = await postgre.query("SELECT * FROM accounts");
			res.json({msg: "OK", data: rows});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	getById: async(req, res) => {
		try {
			const { rows } = await postgre.query("SELECT * FROM accounts WHERE id=$1", [req.params.id]);
			res.json({msg: "OK", data: rows[0]});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	create: async(req, res) => {
		try {
			const { name, parent, balance_must_be, created_modified_by, modified } = req.body;

			const sql = 'INSERT INTO accounts(name, parent, balance_must_be, created_by, modified_by, modified) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';

			const { rows } = await postgre.query(sql, [name, parent, balance_must_be, created_modified_by, created_modified_by, modified]);

			res.json({msg: "OK", data: rows[0]});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	updateById: async(req, res) => {
		try {
			const { parent, balance_must_be, modified_by, modified } = req.body;

			const sql = 'UPDATE accounts set parent = $1, balance_must_be = $2, modified_by = $3, modified = $4 WHERE id = $5 RETURNING *';

			const { rows } = await postgre.query(sql, [parent, balance_must_be, modified_by, modified, req.params.id]);

			res.json({msg: "OK", data: rows[0]});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	deleteById: async(req, res) => {
		try {
			const sql = 'DELETE FROM accounts where id = $1 RETURNING *'

			const { rows } = await postgre.query(sql, [req.params.id])

			if (rows[0]) {
				return res.json({msg: "OK", data: rows[0]})
			}

			return res.status(404).json({msg: "not found"})
			

		} catch (error) {
			res.json({msg: error.msg})
		}
	}
}

module.exports = accountController;