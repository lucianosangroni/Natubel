const { check, validationResult  } = require("express-validator")

const validatorCreateItem = [
    check("monto").exists().isFloat().custom((precio) => precio >= 0),
    check("pedido_id").exists().isInt().custom((id) => id > 0),
    check("persona_id").exists().isInt().custom((id) => id > 0),
    check("numero_factura").exists().isInt().custom((num) => num > 0),
    check("fecha").exists(),
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

const validatorUpdateItem = [
    check("monto").exists().isFloat().custom((precio) => precio >= 0),
    check("numero_factura").exists().isInt().custom((num) => num > 0),
    check("fecha").exists(),
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