const express = require ("express");
const router = express.Router();
const { registerUser } = require("../controllers/userController");

const registerUser = () => {

};

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;