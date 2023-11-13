const { check, validationResult  } = require("express-validator")

const validatorCreateItem = [
    check("numero_articulo").exists().isString().notEmpty(),
    check("nombre").exists().isString().notEmpty(),
    check("descripcion").exists().isString(),
    check("precio_unitario").exists().isFloat().custom((precio_unitario) => precio_unitario > 0),
    check("talles").exists().isArray({ min: 1 }).custom((talles) => talles.every((talle) => typeof talle === "string" && talle.trim() !== "")),
    check("colores").exists().isArray({ min: 1 }).custom((colores) => colores.every((color) => typeof color === "string" && color.trim() !== "")),
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
    check("numero_articulo").exists().isString().notEmpty(),
    check("nombre").exists().isString().notEmpty(),
    check("descripcion").exists().isString(),
    check("precio_unitario").exists().isFloat().custom((precio_unitario) => precio_unitario > 0),
    check("talles").exists().isArray({ min: 1 }).custom((talles) => talles.every((talle) => typeof talle === "string" && talle.trim() !== "")),
    check("colores").exists().isArray({ min: 1 }).custom((colores) => colores.every((color) => typeof color === "string" && color.trim() !== "")),
    check("productos").exists().isArray({ min: 1 }).custom((productos) => productos.every((producto) => 
        typeof producto.producto_id === "number" && producto.producto_id > 0 &&
        typeof producto.talle === "string" && producto.talle.trim() !== "" && 
        typeof producto.color === "string" && producto.color.trim() !== "")),
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