const { check, validationResult  } = require("express-validator")

const validatorCreateItem = [
    check("nombre").exists().isString().notEmpty(),
    check("direccion").exists().isString(),
    check("telefono").exists().isString().notEmpty(),
    check("cuit_cuil").exists().custom((cuit_cuil) => cuit_cuil === null || (typeof cuit_cuil === "number" && cuit_cuil > 0 && String(cuit_cuil).length === 11)),
    check("email").exists().isEmail(),
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
    check("nombre").exists().isString().notEmpty(),
    check("direccion").exists().isString(),
    check("telefono").exists().isString().notEmpty(),
    check("cuit_cuil").exists().custom((cuit_cuil) => cuit_cuil === null || (typeof cuit_cuil === "number" && cuit_cuil > 0 && String(cuit_cuil).length === 11)),
    check("email").exists().isEmail(),
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