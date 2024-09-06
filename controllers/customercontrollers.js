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
	userLogin: async(req, res, internalCall=false) => {
		try {
			const { username, password } = req.body;

			let query_condition = "";

			if (internalCall===true) {
				query_condition = `AND id = ${req.params.id}`;
			}

			const { rows } = await postgre.query(`SELECT * FROM users WHERE username = '${username}' ${query_condition}`);

			if (rows) {
				for (const row of rows) {
					const match = await bcrypt.compare(password, row.password);

					if (internalCall!=true) {
						if (match) {
							row.token = sign({ username: row.username, id: row.id }, "importantsecret");
							return res.json({ msg: "OK", data: row });
						} else {
							return res.json({error: "Wrong Username or Password"});
						}
					} else {
						return match;
					}
				}
			}

			res.status(404).json({msg: "not found"});
		} catch (error) {
			console.log(error)
			res.json({msg: error.msg});
		}
	},
	getUserDetails: async(req, res) => {
		try {
			const { username } = req.body;
			const { rows } = await postgre.query("SELECT first_name, last_name, email, phone_number FROM users WHERE id=$1 AND username=$2", [req.params.id, username]);
			res.json({msg: "OK", data: rows[0]});
		} catch (error) {
			res.json({msg: error.msg});
		}
	},
	create: async(req, res) => {
		try {
			const { username, password, created_modified } = req.body;

			let hash_pass = "";

			const sql = 'INSERT INTO users(username, password, created, modified) VALUES($1, $2, $3, $4) RETURNING *';

			await bcrypt.hash(password, 10).then((hash) => {
				hash_pass = hash;
				// Users.create({
				// 	username: username,
				// 	password: hash,
				// });
		
				// res.json("SUCCESS");
			});

			const { rows } = await postgre.query(sql, [username, hash_pass, created_modified, created_modified]);

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