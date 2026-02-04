const express = require("express")
const router = express.Router();
const { 
    getItems, 
    createItem,
    updateItem,
    deleteItem
    } = require("../controllers/articulos");
const { validateId } = require("../validators/id")
const { validatorCreateItem, validatorUpdateItem } = require("../validators/articulos")
const { checkAuth } = require("../middlewares/auth")
//const { upload } = require("../utils/handleStorage");

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", checkAuth, getItems);
router.post("/", checkAuth, upload.array("files", 8), createItem);
router.put("/:id", checkAuth, validateId, upload.array("files", 8), updateItem);
router.delete("/:id", checkAuth, validateId, deleteItem);

module.exports = router