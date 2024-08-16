const postgre = require('../database');

const bookController = {
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
            const { item_id, item_name, qty, created_modified_by, modified } = req.body;

            const sql = 'INSERT INTO bin(item_id, item_name, qty, created_by, modified_by, modified) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';

            const { rows } = await postgre.query(sql, [item_id, item_name, qty, created_modified_by, created_modified_by, modified]);

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

            if (rows[0]) {
                return res.json({msg: "OK", data: rows[0]});
            }

            return res.status(404).json({msg: "not found"});
        } catch (error) {
            res.json({msg: error.msg})
        }
    }
}

module.exports = bookController