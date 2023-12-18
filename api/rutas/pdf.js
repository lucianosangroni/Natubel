const express = require("express")
const router = express.Router();
const { 
    getStockAdmin,
    getStockCliente,
    getNotaPedido,
    getRemito
    } = require("../controllers/pdf");
const { checkAuth } = require("../middlewares/auth")

router.get("/stock/admin", checkAuth, getStockAdmin);
router.get("/stock/cliente", checkAuth, getStockCliente)
router.get("/nota-pedido/:id", checkAuth, getNotaPedido);
router.get("/remito", checkAuth, getRemito);

module.exports = router