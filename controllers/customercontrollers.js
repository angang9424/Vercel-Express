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
			const { first_name, last_name, dob, phone_number, email, gender, nric, active, created_modified_by, modified } = req.body;

			const sql = 'INSERT INTO customers(first_name, last_name, dob, phone_number, email, gender, nric, active, created_by, modified_by, modified) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *';

			const { rows } = await postgre.query(sql, [first_name, last_name, dob, phone_number, email, gender, nric, active, created_modified_by, created_modified_by, modified]);

			res.json({msg: "OK", data: rows[0]});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	updatePassword: async(req, res) => {
	    try {
	        const { username, password, newPassword, modified } = req.body;
			const compare_pass = await userController.userLogin(req, res, true);

			if (compare_pass) {
				let hash_pass = "";

				const sql = 'UPDATE users SET password = $1, modified = $2 WHERE id = $3 AND username = $4 RETURNING *';

				await bcrypt.hash(newPassword, 10).then((hash) => {
					hash_pass = hash;
				})
				const { rows } = await postgre.query(sql, [hash_pass, modified, req.params.id, username]);
			}

			return res.json({msg: "OK", data: compare_pass});
		} catch (error) {
			console.log(error)
			res.json({msg: error.msg});
		}
	},
	updateUserDetails: async(req, res) => {
	    try {
	        const { first_name, last_name, email, phone_number, modified, username } = req.body;

			const sql = 'UPDATE users SET first_name = $1, last_name = $2, email = $3, phone_number = $4, modified = $5 WHERE id = $6 AND username = $7 RETURNING *';

			const { rows } = await postgre.query(sql, [first_name, last_name, email, phone_number, modified, req.params.id, username]);

			return res.json({msg: "OK", data: rows});
		} catch (error) {
			console.log(error)
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