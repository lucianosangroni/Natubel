const { check, validationResult } = require("express-validator");

const validateLogin = [
    check("nombre_usuario").exists().isString().notEmpty(),
    check("password").exists().isString().notEmpty(),
    (req, res, next) => {
        try {
            validationResult(req).throw()
            return next()
        } catch (err) {
            res.status(403)
            res.send({ errores: err.array() })
        }
    }
];

module.exports = { validateLogin };