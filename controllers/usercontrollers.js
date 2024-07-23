const postgre = require('../database')
const userController = {
    getAll: async(req, res) => {
        try {
            const { rows } = await postgre.query("select * from users")
            res.json({msg: "OK", data: rows})
        } catch (error) {
            res.json({msg: error.msg})
        }
    },
    checkUser: async(req, res) => {
        try {
			const { username, password } = req.body;

            const { rows } = await postgre.query("select * from users where username = $1 and password = $2", [username, password])

            if (rows[0]) {
                return res.json({msg: "OK", data: rows})
            }

            res.status(404).json({msg: "not found"})
        } catch (error) {
            res.json({msg: error.msg})
        }
    },
    create: async(req, res) => {
        try {
            const { username, password } = req.body;

            const sql = 'INSERT INTO users(username, password) VALUES($1, $2) RETURNING *'

            const { rows } = await postgre.query(sql, [username, password])

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