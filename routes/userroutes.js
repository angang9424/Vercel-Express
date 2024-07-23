const express = require("express")
const router = express.Router()

const userController = require('../controllers/usercontrollers')

router.get("/", userController.getAll)
// router.get("/:id", userController.getById)
router.post("/", userController.create)
// router.put("/:id", userController.updateById)
// router.delete("/:id", userController.deleteById)

module.exports = router