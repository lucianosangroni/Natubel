const { check, validationResult  } = require("express-validator")

const validatorCreateItem = [
    check("nombre").exists().isString().notEmpty(),
    check("direccion").exists().isString(),
    check("telefono").exists().isString(),
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
    check("telefono").exists().isString(),
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