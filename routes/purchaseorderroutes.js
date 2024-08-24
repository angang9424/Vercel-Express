const express = require("express");
const router = express.Router();

const purchaseOrderController = require('../controllers/purchaseordercontrollers');

router.get("/", purchaseOrderController.getAll);
router.get("/bookname", purchaseOrderController.getName);
router.get("/:id", purchaseOrderController.getById);
router.post("/", purchaseOrderController.create);
router.post("/createchild", purchaseOrderController.createChild);
router.get("/getpobyid/:id", purchaseOrderController.getPOById);
router.get("/getchildbyid/:id", purchaseOrderController.getChildById);
router.put("/:id", purchaseOrderController.updatePOById);
router.delete("/updatedeletechildbyid/:id", purchaseOrderController.updateDeleteChildById);
router.delete("/:id", purchaseOrderController.deleteById);

module.exports = router;