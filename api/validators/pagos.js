const { check, validationResult  } = require("express-validator")

const validatorCreateItem = [
    check("monto").exists().isFloat().custom((precio) => precio >= 0),
    check("destino").exists().isString(),
    check("persona_id").exists().isInt().custom((id) => id > 0),
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
    check("destino").exists().isString(),
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