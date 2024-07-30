const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();

app.use(cors());
app.use(express.json());

const bookRouter = require('./routes/bookroutes');
const userRouter = require('./routes/userroutes');

app.use("/api/v1/books", bookRouter);
app.use("/api/v1/users", userRouter);

app.listen(process.env.PORT, () => {
	console.log("Server running 3001.");
})