const express = require("express")
const router = express.Router();
const { 
    getItems,
    createItem,
    updateItem,
    deleteItem
    } = require("../controllers/marcas");
const { validateId } = require("../validators/id")
const { validatorCreateItem, validatorUpdateItem } = require("../validators/marcas")
const { checkAuth } = require("../middlewares/auth")

router.get("/", checkAuth, getItems);
router.post("/", checkAuth, validatorCreateItem, createItem);
router.put("/:id", checkAuth, validatorUpdateItem, validateId, updateItem);
router.delete("/:id", checkAuth, validateId, deleteItem);

module.exports = router