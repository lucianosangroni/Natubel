const express = require("express")
const router = express.Router();
const { getItems, updateItem, createItem, deleteItem } = require("../controllers/facturas");
const { validateId } = require("../validators/id")
const { validatorCreateItem, validatorUpdateItem } = require("../validators/facturas")
const { checkAuth } = require("../middlewares/auth")

router.get("/", checkAuth, getItems);
router.post("/", checkAuth, validatorCreateItem, createItem)
router.put("/:id", checkAuth, validateId, validatorUpdateItem, updateItem);
router.delete("/:id", checkAuth, validateId, deleteItem);

module.exports = router