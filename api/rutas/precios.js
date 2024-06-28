const express = require("express")
const router = express.Router();
const { 
    updateItems,
    } = require("../controllers/precios");
const { checkAuth } = require("../middlewares/auth")

router.put("/", checkAuth, updateItems);

module.exports = router