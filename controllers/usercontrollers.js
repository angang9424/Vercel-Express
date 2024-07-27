const postgre = require('../database');
const { sign } = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userController = {
	getAll: async(req, res) => {
		try {
			const { rows } = await postgre.query("select * from users")
			res.json({msg: "OK", data: rows})
		} catch (error) {
			res.json({msg: error.msg})
		}
	},
	userLogin: async(req, res) => {
		try {
			const { username, password } = req.body;

			const { rows } = await postgre.query("select * from users where username = $1", [username]);

			if (rows) {
				for (const row of rows) {
					const match = await bcrypt.compare(password, row.password);

					if (match) {
						row.token = sign({ username: row.username, id: row.id }, "importantsecret");
						return res.json({ msg: "OK", data: rows });
					} else {
						return res.json({error: "Wrong Username or Password"});
					}
				}
			}

			res.status(404).json({msg: "not found"});
		} catch (error) {
			res.json({msg: error.msg})
		}
	},
	create: async(req, res) => {
		try {
			const { username, password } = req.body;
			let hash_pass = "";

			const sql = 'INSERT INTO users(username, password) VALUES($1, $2) RETURNING *'

			await bcrypt.hash(password, 10).then((hash) => {
				hash_pass = hash;
				// Users.create({
				// 	username: username,
				// 	password: hash,
				// });
		
				// res.json("SUCCESS");
			})

			const { rows } = await postgre.query(sql, [username, hash_pass])

			res.json({msg: "OK", data: rows[0]})

		} catch (error) {
			res.json({msg: error.msg})
		}
	},
	// updateById: async(req, res) => {
	//     try {
	//         const { name, price } = req.body

	//         const sql = 'UPDATE books set name = $1, price = $2 where book_id = $3 RETURNING *'

	//         const { rows } = await postgre.query(sql, [name, price, req.params.id])

	//         res.json({msg: "OK", data: rows[0]})

	//     } catch (error) {
	//         res.json({msg: error.msg})
	//     }
	// },
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

module.exports = userController