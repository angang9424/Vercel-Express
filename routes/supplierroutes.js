const express = require("express");
const router = express.Router();

const supplierController = require('../controllers/suppliercontrollers');

router.get("/", supplierController.getAll);
router.get("/:id", supplierController.getById);
router.post("/", supplierController.create);
router.put("/:id", supplierController.updateById);
router.delete("/:id", supplierController.deleteById);

module.exports = router;