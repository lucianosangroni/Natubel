const { check, validationResult  } = require("express-validator")

const validateId = [
    check("id").exists().isInt().custom((id) => id > 0),
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

module.exports = { validateId }