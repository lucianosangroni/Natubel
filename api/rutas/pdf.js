const express = require("express")
const router = express.Router();
const { 
    getStockAdmin,
    getStockCliente,
    getNotaPedido,
    getRemito,
    getCuentaCorriente,
    getHistorial,
    getImputacion
    } = require("../controllers/pdf");
const { checkAuth } = require("../middlewares/auth")

router.get("/stock/admin", checkAuth, getStockAdmin);
router.get("/stock/cliente", checkAuth, getStockCliente)
router.get("/nota-pedido/:id", checkAuth, getNotaPedido);
router.get("/remito/:id", checkAuth, getRemito);
router.get("/cuenta-corriente/:persona_id", checkAuth, getCuentaCorriente);
router.get("/historial/:persona_id", checkAuth, getHistorial);
router.get("/imputacion/:numero_imputacion", checkAuth, getImputacion);

module.exports = router