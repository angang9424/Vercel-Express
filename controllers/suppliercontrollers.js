const postgre = require('../database');

const supplierController = {
	getAll: async(req, res) => {
		try {
			const { rows } = await postgre.query("SELECT * FROM suppliers");
			res.json({msg: "OK", data: rows});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	getById: async(req, res) => {
		try {
			const { rows } = await postgre.query("SELECT * FROM suppliers WHERE id=$1", [req.params.id]);
			res.json({msg: "OK", data: rows[0]});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	create: async(req, res) => {
		try {
			const { company_name, phone_number, address, email, active, created_modified_by, modified } = req.body;

			const sql = 'INSERT INTO suppliers(company_name, phone_number, address, email, active, created_by, modified_by, modified) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';

			const { rows } = await postgre.query(sql, [company_name, phone_number, address, email, active, created_modified_by, created_modified_by, modified]);

			res.json({msg: "OK", data: rows[0]});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	updateById: async(req, res) => {
		try {
			const { company_name, phone_number, address, email, active, modified_by, modified } = req.body;

			const sql = 'UPDATE suppliers set company_name = $1, phone_number = $2, address = $3, email = $4, active = $5, modified_by = $6, modified = $7 WHERE id = $8 RETURNING *';

			const { rows } = await postgre.query(sql, [company_name, phone_number, address, email, active, modified_by, modified, req.params.id]);

			res.json({msg: "OK", data: rows[0]});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	deleteById: async(req, res) => {
		try {
			const sql = 'DELETE FROM suppliers where id = $1 RETURNING *'

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

module.exports = supplierController;