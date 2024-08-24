const express = require("express");
const router = express.Router();

const salesController = require('../controllers/salesordercontrollers');

router.get("/", salesController.getAll);
router.get("/bookname", salesController.getName);
router.get("/:id", salesController.getById);
router.post("/", salesController.create);
router.post("/createchild", salesController.createChild);
router.get("/getpobyid/:id", salesController.getPOById);
router.get("/getchildbyid/:id", salesController.getChildById);
router.put("/:id", salesController.updatePOById);
router.delete("/updatedeletechildbyid/:id", salesController.updateDeleteChildById);
router.delete("/:id", salesController.deleteById);

module.exports = router;