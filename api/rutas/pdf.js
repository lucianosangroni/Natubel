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

router.get("/stock-admin", getStockAdmin);
router.get("/stock-cliente", getStockCliente)
router.get("/nota-pedido/:id", getNotaPedido);
router.get("/remito/:id", getRemito);
router.get("/cuenta-corriente/:persona_id", getCuentaCorriente);
router.get("/historial/:persona_id", getHistorial);
router.get("/imputacion/:numero_imputacion", getImputacion);

module.exports = router