const express = require("express")
const router = express.Router();
const { 
    getItem, 
    createItem,
    updateItem,
    } = require("../controllers/remitos");
const { validateId } = require("../validators/id")
const { validatorCreateItem, validatorUpdateItem } = require("../validators/remitos")
const { checkAuth } = require("../middlewares/auth")

router.get("/:id", checkAuth, validateId, getItem);
router.post("/", checkAuth, validatorCreateItem, createItem);
router.put("/:id", checkAuth, validatorUpdateItem, validateId, updateItem);

module.exports = router