const { imputacionModel, pagoModel, facturaModel } = require("../modelos");
const { matchedData } = require("express-validator");

const getItems = async (req, res) => {
    try {
        const imputaciones = await imputacionModel.findAll()
        res.status(200).send(imputaciones)
    } catch (e) {
        console.log("Error al buscar las imputaciones: ", e)
        res.status(500).json({ message: 'Error al buscar las imputaciones' });
    }
};

const createItem = async (req, res) => {
    try {
        req = matchedData(req);

        const { facturas, pagos, monto_sobrante, persona_id } = req

        const ultimoNumeroImputacion = await imputacionModel.max('numero_imputacion');
        const numeroImputacion = ultimoNumeroImputacion ? ultimoNumeroImputacion + 1 : 1;

        const filasImputacion = [];
        for (const pago_id of pagos) {
            for (const factura_id of facturas) {
                filasImputacion.push({ pago_id, factura_id, numero_imputacion: numeroImputacion });
            }
        }

        await imputacionModel.bulkCreate(filasImputacion);

        await pagoModel.update(
            { flag_imputado: true },
            { where: { id: pagos } }
        );

        await facturaModel.update(
            { flag_imputada: true },
            { where: { id: facturas } }
        );
        
        let nuevoPago = null

        if(monto_sobrante > 0) {
            nuevoPago = await pagoModel.create
            (
                {
                    monto: monto_sobrante,
                    destino: "Sobrante - Cobranza " + numeroImputacion,
                    persona_id: persona_id,
                    pago_padre_id: pagos[0]
                }
            )
        }

        res.status(201).json({ message: 'Cobranza creada con éxito', nuevoPago});
    } catch(e) {
        console.log("Error al crear la imputacion: ", e)
        res.status(500).json({ message: 'Error al crear la imputacion' });
    }
};

module.exports = {getItems, createItem};