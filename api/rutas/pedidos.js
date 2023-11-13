const express = require("express")
const router = express.Router();
const { 
    getItems, 
    createItem,
    updateItem,
    } = require("../controllers/pedidos");
const { validateId } = require("../validators/id")
const { validatorCreateItem, validatorUpdateItem } = require("../validators/pedidos")

router.get("/", getItems);
router.post("/", validatorCreateItem, createItem);
router.put("/:id", validatorUpdateItem, validateId, updateItem);

module.exports = router