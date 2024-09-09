const postgre = require('../database');

const customerController = {
	getAll: async(req, res) => {
		try {
			const { rows } = await postgre.query("SELECT * FROM customers");
			res.json({msg: "OK", data: rows});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	getById: async(req, res) => {
		try {
			const { rows } = await postgre.query("SELECT * FROM customers WHERE id=$1", [req.params.id]);
			res.json({msg: "OK", data: rows[0]});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	create: async(req, res) => {
		try {
			const { first_name, last_name, full_name, dob, phone_number, email, gender, nric, active, created_modified_by, modified } = req.body;

			const sql = 'INSERT INTO customers(first_name, last_name, full_name, dob, phone_number, email, gender, nric, active, created_by, modified_by, modified) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *';

			const { rows } = await postgre.query(sql, [first_name, last_name, full_name, dob, phone_number, email, gender, nric, active, created_modified_by, created_modified_by, modified]);

			res.json({msg: "OK", data: rows[0]});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	updateById: async(req, res) => {
		try {
			const { first_name, last_name, full_name, dob, phone_number, email, gender, nric, active, modified_by, modified } = req.body;

			const sql = 'INSERT INTO customers(first_name, last_name, full_name, dob, phone_number, email, gender, nric, active, modified_by, modified) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *';

			const { rows } = await postgre.query(sql, [first_name, last_name, full_name, dob, phone_number, email, gender, nric, active, modified_by, modified]);

			res.json({msg: "OK", data: rows[0]});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	// deleteById: async(req, res) => {
	//     try {
	//         const sql = 'DELETE FROM books where book_id = $1 RETURNING *'

	//         const { rows } = await postgre.query(sql, [req.params.id])

	//         if (rows[0]) {
	//             return res.json({msg: "OK", data: rows[0]})
	//         }

	//         return res.status(404).json({msg: "not found"})
			

	//     } catch (error) {
	//         res.json({msg: error.msg})
	//     }
	// }
}

module.exports = customerController;