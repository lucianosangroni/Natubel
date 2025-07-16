const { cuponModel } = require("../modelos");

const getItem = async (req, res) => {
    try {
        const clave = req.params.clave

        const cupon = await cuponModel.findOne({
            where: { clave, flag_eliminado: false }
        })

        if (!cupon) return res.status(200).json({message: 'No existe el cupón'})

        if (!cupon.flag_activo) return res.status(200).json({message: 'El cupón está desactivado'})

        let vencio = false;

        if (cupon.fecha_fin) {
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0); // normalizar hoy

            const fechaFin = new Date(cupon.fecha_fin);
            fechaFin.setHours(0, 0, 0, 0); // normalizar fechaFin

            // Si hoy es mayor, venció. Si hoy es igual o menor, todavía sirve.
            vencio = hoy > fechaFin;
        }

        if (vencio) return res.status(200).json({ message: 'El cupón está vencido' });

        res.status(200).json({ message: 'El cupón se canjeó con éxito', descuento: cupon.descuento, id: cupon.id });
    } catch (e) {
        console.log("Error al buscar los cupones: ", e)
        res.status(500).json({ message: 'Error al buscar los cupones' });
    }
}

const getItems = async (req, res) => {
    try {
        const cupones = await cuponModel.findAll({
            where: { flag_eliminado: false }
        })
        res.status(200).send(cupones)
    } catch (e) {
        console.log("Error al buscar los cupones: ", e)
        res.status(500).json({ message: 'Error al buscar los cupones' });
    }
};

const createItem = async (req, res) => {
    try {
        const { clave, descuento, dias_validez } = req.body
        
        let fecha_fin = null

        if(dias_validez !== 0) {
            const hoy = new Date();
            hoy.setDate(hoy.getDate() + parseInt(dias_validez));
            fecha_fin = hoy.toISOString().split('T')[0];
        }

        const nuevoCupon = await cuponModel.create
        (
            {
                clave,
                descuento,
                fecha_fin,
            }
        )

        res.status(201).json({ message: 'Cupon creado con éxito', id: nuevoCupon.id });
    } catch(e) {
        console.log("Error al crear el cupon: ", e)
        res.status(500).json({ message: 'Error al crear el cupon' });
    }
};

const updateItem = async (req, res) => {
    try {
        const cupon_id = req.params.id
        const { clave, descuento, fecha_fin } = req.body

        // Validar si el articulo existe antes de intentar actualizarla
        const cuponExiste = await cuponModel.findByPk(cupon_id);
        if (!cuponExiste) {
            return res.status(404).json({ message: 'Cupon no encontrado' });
        }

        await cuponModel.update
        (
            {
                clave,
                descuento,
                fecha_fin,
            },
            {
                where: {id: cupon_id}
            }
        )

        res.status(201).json({ message: 'Cupon editado con éxito' });
    } catch(e) {
        console.log("Error al editar el cupon: ", e)
        res.status(500).json({ message: 'Error al editar el cupon' });
    }
};

const cambiarActivacionItem = async (req, res) => {
    try {
        const cupon_id = req.params.id

        const cuponExiste = await cuponModel.findByPk(cupon_id);
        if (!cuponExiste) {
            return res.status(404).json({ message: 'Cupon no encontrado' });
        }

        await cuponModel.update
            (
                {
                    flag_activo: !cuponExiste.flag_activo
                }, 
                {
                where: { id: cupon_id }
                }
            )

        res.status(200).json({ message: 'Cupon editado con éxito' });
    } catch(e) {
        console.log("Error al editar el cupon: ", e)
        res.status(500).json({ message: 'Error al editar el cupon' });
    }
};

const deleteItem = async (req, res) => {
    try {
        const cupon_id = req.params.id

        // Validar si el articulo existe antes de intentar actualizarla
        const cuponExiste = await cuponModel.findByPk(cupon_id);
        if (!cuponExiste) {
            return res.status(404).json({ message: 'Cupon no encontrado' });
        }

        await cuponModel.update
            (
                {
                    flag_eliminado: true
                }, 
                {
                    where: { id: cupon_id }
                }
            )

        res.status(200).json({ message: 'Cupon eliminado con éxito' });
    } catch(e) {
        console.log("Error al eliminar el cupon: ", e)
        res.status(500).json({ message: 'Error al eliminar el cupon' });
    }
};


module.exports = { getItem, getItems, createItem, updateItem, cambiarActivacionItem, deleteItem };