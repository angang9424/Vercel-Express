const express = require("express");
const router = express.Router();

const companyController = require('../controllers/companycontrollers');

router.get("/", companyController.getAll);
router.get("/:id", companyController.getById);
router.post("/", companyController.create);
router.put("/:id", companyController.updateById);
router.delete("/:id", companyController.deleteById);

module.exports = router;