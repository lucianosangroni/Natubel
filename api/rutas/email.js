const express = require("express")
const router = express.Router();
const { 
    sendEmail
    } = require("../controllers/email");
const { checkAuth } = require("../middlewares/auth")

router.post("/", checkAuth, sendEmail);

module.exports = router