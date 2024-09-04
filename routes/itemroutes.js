const express = require("express");
const router = express.Router();

const itemController = require('../controllers/itemcontrollers');

router.get("/", itemController.getAll);
router.get("/itemname", itemController.getName);
router.get("/:id", itemController.getById);
router.post("/", itemController.create);
router.put("/:id", itemController.updateById);
router.delete("/:id", itemController.deleteById);

module.exports = router;