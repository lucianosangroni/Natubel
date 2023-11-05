const express = require("express")
const router = express.Router();
const { 
    getItems, 
    createItem,
    updateItem,
    deleteItem
    } = require("../controllers/clientes");

router.get("/", getItems);
router.post("/", createItem);
router.put("/", updateItem);
router.delete("/", deleteItem);

module.exports = router