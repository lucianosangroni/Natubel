const express = require("express")
const router = express.Router();
const { 
    getItem,
    getItems, 
    createItem,
    updateItem,
    cambiarActivacionItem,
    deleteItem
    } = require("../controllers/cupones");
const { validateId } = require("../validators/id")
const { checkAuth } = require("../middlewares/auth")

router.get("/:clave", checkAuth, getItem);
router.get("/", checkAuth, getItems);
router.post("/", checkAuth, createItem);
router.put("/:id", checkAuth, validateId, updateItem);
router.put("/activacion/:id", checkAuth, validateId, cambiarActivacionItem);
router.delete("/:id", checkAuth, validateId, deleteItem);

module.exports = router