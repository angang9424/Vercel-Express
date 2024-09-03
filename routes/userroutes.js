const express = require("express");
const router = express.Router();
const multer = require('multer');

const userController = require('../controllers/usercontrollers');
const upload = multer({ dest: '../uploads/' });

router.get("/", userController.getAll);
router.post("/userLogin", userController.userLogin);
router.post("/getUserDetails/:id", userController.getUserDetails);
router.post("/", userController.create);
router.post("/userpropic", upload.single('file'), userController.userProPic);
router.put("/updatePassword/:id", userController.updatePassword);
router.put("/updateUserDetails/:id", userController.updateUserDetails);
// router.delete("/:id", userController.deleteById);

module.exports = router;