const postgre = require('../database');

const companyController = {
	getAll: async(req, res) => {
		try {
			const { rows } = await postgre.query("SELECT * FROM company");
			res.json({msg: "OK", data: rows});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	getById: async(req, res) => {
		try {
			const { rows } = await postgre.query("SELECT * FROM company WHERE id=$1", [req.params.id]);
			res.json({msg: "OK", data: rows[0]});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	create: async(req, res) => {
		try {
			const { company_name, gst, active, created_modified_by, modified } = req.body;

			const sql = 'INSERT INTO company(company_name, gst, active, created_by, modified_by, modified) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';

			const { rows } = await postgre.query(sql, [company_name, gst, active, created_modified_by, created_modified_by, modified]);

			res.json({msg: "OK", data: rows[0]});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	updateById: async(req, res) => {
		try {
			const { first_name, last_name, full_name, dob, phone_number, email, gender, nric, active, modified_by, modified } = req.body;

			const sql = 'UPDATE company set first_name = $1, last_name = $2, full_name = $3, dob = $4, phone_number = $5, email = $6, gender = $7, nric = $8, active = $9, modified_by = $10, modified = $11 WHERE id = $12 RETURNING *';

			const { rows } = await postgre.query(sql, [first_name, last_name, full_name, dob, phone_number, email, gender, nric, active, modified_by, modified, req.params.id]);

			res.json({msg: "OK", data: rows[0]});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	deleteById: async(req, res) => {
		try {
			const sql = 'DELETE FROM company where id = $1 RETURNING *'

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

module.exports = companyController;