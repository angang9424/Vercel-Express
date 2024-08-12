const express = require("express");
const router = express.Router();

const bookController = require('../controllers/purchaseordercontrollers');

router.get("/", bookController.getAll);
router.get("/bookname", bookController.getName);
router.get("/:id", bookController.getById);
router.post("/", bookController.create);
router.post("/createchild", bookController.createChild);
router.get("/getpobyid/:id", bookController.getPOById);
router.get("/getchildbyid/:id", bookController.getChildById);
router.put("/:id", bookController.updatePOById);
router.delete("/updatedeletechildbyid/:id", bookController.updateDeleteChildById);
router.delete("/:id", bookController.deleteById);

module.exports = router;