const express = require("express");
const router = express.Router();

const userController = require('../controllers/usercontrollers');

router.get("/", userController.getAll);
router.post("/userLogin", userController.userLogin);
router.post("/getUserData/:id", userController.getUserData);
router.post("/", userController.create);
router.put("/updatePassword/:id", userController.updatePassword);
// router.delete("/:id", userController.deleteById);

module.exports = router;