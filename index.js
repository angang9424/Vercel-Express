const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();

app.use(cors());
app.use(express.json());

const bookRouter = require('./routes/bookroutes');
const userRouter = require('./routes/userroutes');
const purchaseOrderRouter = require('./routes/purchaseorderroutes');
const salesOrderRouter = require('./routes/salesorderroutes');

app.use("/api/v1/books", bookRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/purchaseOrders", purchaseOrderRouter);
app.use("/api/v1/salesOrders", salesOrderRouter);

app.listen(process.env.PORT, () => {
	console.log("Server running 3001.");
})