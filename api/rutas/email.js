const express = require("express")
const multer = require('multer');
const upload = multer();
const router = express.Router();
const { 
    sendEmailCodigo,
    sendEmailPedido
    } = require("../controllers/email");
const { checkAuth } = require("../middlewares/auth")

router.post("/codigo", checkAuth, sendEmailCodigo);
router.post("/pedido", checkAuth, upload.single('file'), sendEmailPedido)

module.exports = router