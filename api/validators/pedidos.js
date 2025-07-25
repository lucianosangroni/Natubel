const { check, validationResult  } = require("express-validator")

const validatorCreateItem = [
    check("persona_id").exists().isInt().custom((id) => id > 0),
    check("precio_total").exists().isFloat().custom((precio_total) => precio_total >= 0),
    check("es_proveedor").exists().isBoolean(),
    check("creador").exists().isString().notEmpty(),
    check("cupon_id").exists(),
    check("flag_de_marca").exists(),
    check("numero_factura").exists(),
    check("monto_factura").exists(),
    check("fecha_factura").exists(),
    check("tipo_precio").exists(),
    check("productos").exists().isArray({ min: 1 }).custom((productos) => productos.every((producto) => 
        typeof producto.producto_id === "number" && producto.producto_id > 0 &&
        typeof producto.cantidad === "number" && producto.cantidad > 0 &&
        parseFloat(producto.precio_unitario) >= 0)),
    (req, res, next) => {
        req.body.productos.forEach((producto) => {
            producto.precio_unitario = parseFloat(producto.precio_unitario);
        });

        try {
            validationResult(req).throw()
            return next()
        } catch (err) {
            res.status(403)
            res.send({ errores: err.array() })
        }
    }
]

const validatorUpdateItem = [
    check("estado").exists().isIn(['CANCELADO','PEDIDO','ENVIADO','PAGADO','COMPLETADO']),
    check("razon_cancelado").exists().isString(),
    check("productos").exists().isArray().custom((productos) => productos.every((producto) => 
        typeof producto.producto_id === "number" && producto.producto_id > 0 &&
        typeof producto.cantidad === "number" && producto.cantidad > 0)),
    (req, res, next) => {
        try {
            validationResult(req).throw()
            return next()
        } catch (err) {
            res.status(403)
            res.send({ errores: err.array() })
        }
    }
]



module.exports = { validatorCreateItem, validatorUpdateItem }