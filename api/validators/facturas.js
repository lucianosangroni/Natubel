const { check, validationResult  } = require("express-validator")

const validatorUpdateItem = [
    check("monto").exists().isFloat().custom((precio) => precio >= 0),
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

module.exports = { validatorUpdateItem }