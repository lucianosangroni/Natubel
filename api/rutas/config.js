const express = require("express")
const router = express.Router();
const { 
    getItem,
    updateItem,
    } = require("../controllers/config");
const { checkAuth } = require("../middlewares/auth")

router.get("/", checkAuth, getItem);
router.put("/", checkAuth, updateItem);

module.exports = router