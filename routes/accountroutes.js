const express = require("express");
const router = express.Router();

const accountController = require('../controllers/accountcontrollers');

router.get("/", accountController.getAll);
router.get("/accountsgetall", accountController.accountsGetAll);
router.get("/:id", accountController.getById);
router.post("/", accountController.create);
router.put("/:id", accountController.updateById);
router.delete("/:id", accountController.deleteById);

module.exports = router;