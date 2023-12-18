const { check, validationResult  } = require("express-validator")

const validatorCreateItem = [
    check("nombre").exists().isString().notEmpty(),
    check("dni").exists().custom((dni) => dni === null || (typeof dni === "number" && dni > 0 && String(dni).length === 8)),
    check("cuit_cuil").exists().custom((cuit_cuil) => cuit_cuil === null || (typeof cuit_cuil === "number" && cuit_cuil > 0 && String(cuit_cuil).length === 11)),
    check("email").exists().isEmail(),
    check("telefono").exists().isString().notEmpty(),
    check("tipo_cliente").exists().isIn(["MINORISTA", "MAYORISTA"]),
    check("forma_de_envio").exists().isString(),
    check("direccion").exists().isString(),
    check("codigo_postal").exists().isString(),
    check("ciudad").exists().isString(),
    check("provincia").exists().isString(),
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
    check("dni").exists().custom((dni) => dni === null || (typeof dni === "number" && dni > 0 && String(dni).length === 8)),
    check("cuit_cuil").exists().custom((cuit_cuil) => cuit_cuil === null || (typeof cuit_cuil === "number" && cuit_cuil > 0 && String(cuit_cuil).length === 11)),
    check("email").exists().isEmail(),
    check("telefono").exists().isString().notEmpty(),
    check("tipo_cliente").exists().isIn(["MINORISTA", "MAYORISTA"]),
    check("forma_de_envio").exists().isString(),
    check("direccion").exists().isString(),
    check("codigo_postal").exists().isString(),
    check("ciudad").exists().isString(),
    check("provincia").exists().isString(),
    check("persona_id").exists().isInt().custom((persona_id) => persona_id > 0),
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