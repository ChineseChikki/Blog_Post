const router = require("express").Router();

const userController = require("../controllers/userController");
const authMiddleWare = require("../middlewares/authjwt");

//FOR USER CONTROLLER PATHS
router.post("/register", userController.register);
router.post("/logIn", userController.logIn);
router.put("/update", authMiddleWare, userController.updateAUser);
router.get("/user/:id", authMiddleWare, userController.getUserById)
router.delete("/delete/:user_id", userController.deleteUserById);

module.exports = router;