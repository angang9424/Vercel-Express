const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
})

pool.connect((err) => {
	if (err) throw err;
	console.log("Connect Success");
})

module.exports = pool;