const express = require("express")
const router = express.Router();
const { getItems, createItem } = require("../controllers/imputaciones");
const { validatorCreateItem } = require("../validators/imputaciones")
const { checkAuth } = require("../middlewares/auth")

router.get("/", checkAuth, getItems);
router.post("/", checkAuth, validatorCreateItem, createItem)

module.exports = router