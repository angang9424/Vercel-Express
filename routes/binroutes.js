const express = require("express");
const router = express.Router();

const binController = require('../controllers/bincontrollers');

router.get("/", binController.getAll);
router.get("/bookname", binController.getName);
router.get("/:id", binController.getById);
router.post("/", binController.create);
router.put("/:id", binController.updateById);
router.delete("/:id", binController.deleteById);

module.exports = router;