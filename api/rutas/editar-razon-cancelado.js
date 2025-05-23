const express = require("express")
const router = express.Router();
const {
    updateItem
} = require("../controllers/editar-razon-cancelado")
const { validateId } = require("../validators/id")
const { checkAuth } = require("../middlewares/auth")

router.put("/:id", checkAuth, validateId, updateItem);

module.exports = router