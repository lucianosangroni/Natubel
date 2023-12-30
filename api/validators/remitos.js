const { check, validationResult  } = require("express-validator")

const validatorCreateItem = [
    check("descuento").exists().isFloat().custom((descuento) => descuento >= 0 && descuento <= 100),
    check("dias_vencimiento").exists().isInt(),
    check("cantidad_cajas").exists().isInt(),
    check("pedido_id").exists().isInt().custom((id) => id > 0),   
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
    check("descuento").exists().isFloat().custom((descuento) => descuento >= 0 && descuento <= 100),
    check("dias_vencimiento").exists().isInt(),
    check("cantidad_cajas").exists().isInt(),   
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