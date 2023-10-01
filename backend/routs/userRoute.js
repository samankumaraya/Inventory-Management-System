const express = require ("express");
const router = express.Router();
const { registerUser } = require("../controllers/userController");

const registerUser = () => {

};

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/getuser", protect, getUser);

module.exports = router;