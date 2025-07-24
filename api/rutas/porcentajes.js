const express = require("express")
const router = express.Router();
const { getItems, createItem } = require("../controllers/porcentajes");
const { checkAuth } = require("../middlewares/auth")

router.get("/", checkAuth, getItems);
router.post("/", checkAuth, createItem);

module.exports = router