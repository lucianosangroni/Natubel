const { check, validationResult  } = require("express-validator")

const validatorCreateItem = [
    check("facturas").exists().isArray().custom((array) => array.every((id) => typeof id === "number" && id > 0)),
    check("pagos").exists().isArray().custom((array) => array.every((id) => typeof id === "number" && id > 0)),
    check("monto_sobrante").exists().isFloat().custom((monto) => monto >= 0),
    check("persona_id").exists().isInt().custom(id => id > 0),
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

module.exports = { validatorCreateItem }