const express = require("express")
const router = express.Router();
const { getItems, createItem, updateItem, deleteItem } = require("../controllers/pagos");
const { validateId } = require("../validators/id")
const { validatorCreateItem, validatorUpdateItem } = require("../validators/pagos")
const { checkAuth } = require("../middlewares/auth")

router.get("/", checkAuth, getItems);
router.post("/", checkAuth, validatorCreateItem, createItem)
router.put("/:id", checkAuth, validateId, validatorUpdateItem, updateItem);
router.delete("/:id", checkAuth, validateId, deleteItem);

module.exports = router