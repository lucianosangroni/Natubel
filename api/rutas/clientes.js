const express = require("express")
const router = express.Router();
const { 
    getItems, 
    createItem,
    updateItem,
    deleteItem
    } = require("../controllers/clientes");
const { validateId } = require("../validators/id")
const { validatorCreateItem, validatorUpdateItem } = require("../validators/clientes")

router.get("/", getItems);
router.post("/", validatorCreateItem, createItem);
router.put("/:id", validatorUpdateItem, validateId, updateItem);
router.delete("/:id", validateId, deleteItem);

module.exports = router