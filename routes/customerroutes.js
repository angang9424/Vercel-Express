const express = require("express");
const router = express.Router();

const customerController = require('../controllers/customercontrollers');

router.get("/", customerController.getAll);
// router.get("/:id", customerController.getById);
router.post("/", customerController.create);
// router.put("/:id", customerController.updateById);
// router.delete("/:id", customerController.deleteById);

module.exports = router;