const express = require("express");
const router = express.Router();

const itemController = require('../controllers/itemcontrollers');

router.get("/", itemController.getAll);
router.get("/itemcatgetall", itemController.itemCatGetAll);
router.get("/itempricegetall", itemController.itemPriceGetAll);
router.get("/itempricebyitemid/:id", itemController.itemPriceByItemID);
router.get("/itemname", itemController.getName);
router.get("/:id", itemController.getById);
router.post("/", itemController.create);
router.post("/itemcatcreate", itemController.itemCatCreate);
router.put("/:id", itemController.updateById);
router.delete("/:id", itemController.deleteById);

module.exports = router;