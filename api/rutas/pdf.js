const express = require("express")
const router = express.Router();
const { 
    getStock,
    getNotaPedido,
    getRemito
    } = require("../controllers/pdf");
const { checkAuth } = require("../middlewares/auth")

router.get("/stock", checkAuth, getStock);
router.get("/nota-pedido", checkAuth, getNotaPedido);
router.get("/remito", checkAuth, getRemito);

module.exports = router