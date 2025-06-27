const express = require("express")
const router = express.Router();
const { 
    getStockAdmin,
    getStockCliente,
    getNotaPedido,
    getRemitoNatubel,
    getRemitoLody,
    getCuentaCorriente,
    getHistorial,
    getImputacion
    } = require("../controllers/pdf");

router.get("/stock-admin", getStockAdmin);
router.get("/stock-cliente", getStockCliente)
router.get("/nota-pedido/:id", getNotaPedido);
router.get("/remito/Natubel/:id", getRemitoNatubel);
router.get("/remito/Lody/:id", getRemitoLody);
router.get("/cuenta-corriente/:persona_id", getCuentaCorriente);
router.get("/historial/:persona_id", getHistorial);
router.get("/imputacion/:numero_imputacion", getImputacion);

module.exports = router