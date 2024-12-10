const express = require("express")
const router = express.Router();
const { getItems, updateItem } = require("../controllers/facturas");
const { validateId } = require("../validators/id")
const { validatorUpdateItem } = require("../validators/facturas")
const { checkAuth } = require("../middlewares/auth")

router.get("/", checkAuth, getItems);
router.put("/:id", checkAuth, validateId, validatorUpdateItem, updateItem);

module.exports = router