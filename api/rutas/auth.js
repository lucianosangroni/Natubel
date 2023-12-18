const express = require("express");
const router = express.Router();
const { login } = require("../controllers/auth");
const { validateLogin } = require("../validators/auth");

router.post("/", /*validateLogin,*/ login);

module.exports = router;