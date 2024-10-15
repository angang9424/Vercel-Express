const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();

app.use(cors());
app.use(express.json());

const itemRouter = require('./routes/itemroutes');
const userRouter = require('./routes/userroutes');
const accountRouter = require('./routes/accountroutes');
const companyRouter = require('./routes/companyroutes');
const customerRouter = require('./routes/customerroutes');
const supplierRouter = require('./routes/supplierroutes');
const purchaseOrderRouter = require('./routes/purchaseorderroutes');
const salesOrderRouter = require('./routes/salesorderroutes');

app.use("/api/v1/items", itemRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/accounts", accountRouter);
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/customers", customerRouter);
app.use("/api/v1/suppliers", supplierRouter);
app.use("/api/v1/purchaseOrders", purchaseOrderRouter);
app.use("/api/v1/salesOrders", salesOrderRouter);

app.listen(process.env.PORT, () => {
	console.log("Server running 3002.");
})