const express = require("express")
const router = express.Router();
const { 
    getItems, 
    createItem,
    updateItem,
    } = require("../controllers/pedidos");

router.get("/", getItems);
router.post("/", createItem);
router.put("/:id", updateItem);

module.exports = router