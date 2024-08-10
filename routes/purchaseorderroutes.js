const express = require("express");
const router = express.Router();

const bookController = require('../controllers/purchaseordercontrollers');

router.get("/", bookController.getAll);
router.get("/bookname", bookController.getName);
router.get("/:id", bookController.getById);
router.post("/", bookController.create);
router.post("/createchild", bookController.createchild);
router.put("/:id", bookController.updateById);
router.delete("/:id", bookController.deleteById);

module.exports = router;