const { pedidoModel } = require("../modelos");

const updateItem = async (req, res) => {
    try {
        const pedido_id = req.params.id
        const { razon_cancelado } = req.body

        // Validar si el pedido existe antes de intentar actualizarla
        const pedido = await pedidoModel.findByPk(pedido_id);
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        await pedidoModel.update({
            razon_cancelado
        }, { 
            where: { numero_pedido: pedido_id}
        })

        res.status(200).json({ message: 'Pedido editado con éxito' });
    } catch(e) {
        console.log("Error al editar el pedido: ", e)
        res.status(500).json({ message: 'Error al editar el pedido' });
    }
};

module.exports = {updateItem};