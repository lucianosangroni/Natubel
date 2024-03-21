const { check, validationResult  } = require("express-validator")

const validatorCreateItem = [
    check("numero_articulo").exists().isString().notEmpty(),
    check("categorias").exists().isArray({ min: 1 }).custom((categorias) => categorias.every((categoria) => Number.isInteger(categoria))),
    check("descripcion").exists().isString(),
    check("precio_mayorista").exists().isFloat().custom((precio) => precio >= 0),
    check("precio_minorista").exists().isFloat().custom((precio) => precio >= 0),
    check("precio_distribuidor").exists().isFloat().custom((precio) => precio >= 0),
    check("talles").exists().isArray({ min: 1 }).custom((talles) => talles.every((talle) => typeof talle === "string" && talle.trim() !== "")),
    check("colores").exists().isArray({ min: 1 }).custom((colores) => colores.every((color) => typeof color === "string" && color.trim() !== "")),
    check("imagenes").exists().isArray(),
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
    check("categorias").exists().isArray({ min: 1 }).custom((categorias) => categorias.every((categoria) => Number.isInteger(categoria))),
    check("descripcion").exists().isString(),
    check("precio_mayorista").exists().isFloat().custom((precio) => precio >= 0),
    check("precio_minorista").exists().isFloat().custom((precio) => precio >= 0),
    check("precio_distribuidor").exists().isFloat().custom((precio) => precio >= 0),
    check("talles").exists().isArray({ min: 1 }).custom((talles) => talles.every((talle) => typeof talle === "string" && talle.trim() !== "")),
    check("colores").exists().isArray({ min: 1 }).custom((colores) => colores.every((color) => typeof color === "string" && color.trim() !== "")),
    check("productos").exists().isArray({ min: 1 }).custom((productos) => productos.every((producto) => 
        typeof producto.producto_id === "number" && producto.producto_id > 0 &&
        typeof producto.talle === "string" && producto.talle.trim() !== "" && 
        typeof producto.color === "string" && producto.color.trim() !== "")),
    check("imagenes").exists().isArray(),
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