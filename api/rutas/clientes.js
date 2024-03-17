const express = require("express")
const router = express.Router();
const { 
    getItem,
    getItems, 
    createItem,
    updateItem,
    deleteItem
    } = require("../controllers/clientes");
const { validateId } = require("../validators/id")
const { validatorCreateItem, validatorUpdateItem } = require("../validators/clientes")
const { checkAuth } = require("../middlewares/auth")

router.post("/unico", checkAuth, getItem)
router.get("/", checkAuth, getItems);
router.post("/", checkAuth, validatorCreateItem, createItem);
router.put("/:id", checkAuth, validatorUpdateItem, validateId, updateItem);
router.delete("/:id", checkAuth, validateId, deleteItem);

module.exports = router