const { articuloModel, productoModel, mlTokenModel, imagenModel } = require("../modelos");

const getFirstToken = async (req, res) => {
    const code = req.query.code

    if (!code) return res.status(400).send("No se recibió código de autorización");

    try {
      // Intercambiar code por token
        const body = new URLSearchParams({
            grant_type: "authorization_code",
            client_id: process.env.ML_CLIENT_ID,
            client_secret: process.env.ML_CLIENT_SECRET,
            code,
            redirect_uri: process.env.ML_REDIRECT_URI
        });

        const response = await fetch("https://api.mercadolibre.com/oauth/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(err);
        }

        const data = await response.json();
        const { access_token, refresh_token, expires_in } = data;

        // Guardar en DB
        await mlTokenModel.destroy({ where: {} }); // borrar tokens viejos
        await mlTokenModel.create({
            access_token,
            refresh_token,
            expires_at: Date.now() + expires_in * 1000
        });

        // Mensaje simple para el cliente
        res.send("✅ Autorización completada! Ahora ya podés publicar artículos desde el admin.");

    } catch (err) {
        console.error("Error obteniendo token inicial ML:", err);
        res.status(500).send("❌ Error al obtener token inicial");
    }
}

const createItem = async (req, res) => {
    try {
        const tokenML = await getTokenMl()

        if(!tokenML) {
            return res.json({
                need_auth: true,
                auth_url: buildAuthUrl()
            })
        }

        const articulo_id = req.params.id

        const articulo = await articuloModel.findByPk(articulo_id, {
            include: {
                model: productoModel,
            }
        })

        if(!articulo){
            return res.status(404).json({ message: 'Articulo no encontrado' });
        }

        const imagenes = await imagenModel.findAll({
            where: { articulo_id: articulo.id }
        });
        const pictures = imagenes.map(img => ({ source: img.url }));

        const body = {
            title: articulo.numero_articulo,
            category_id: "MLA1196", 
            price: articulo.precio_minorista,
            currency_id: "ARS",
            available_quantity: 0,
            buying_mode: "buy_it_now",
            listing_type_id: "gold_special",
            condition: "new",

            variations: articulo.productos.map(p => ({
                attribute_combinations: [
                    { id: "COLOR", value_name: p.color },
                    { id: "SIZE", value_name: p.talle }
                ],
                available_quantity: p.stock >= 0 ? p.stock : 0
            })),

            pictures
        };
        
        const response = await fetch("https://api.mercadolibre.com/items", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenML}`
            },
            body: JSON.stringify(body)
        })

        if (!response.ok) {
            const err = await response.text()
            console.log("Error al crear la publicacion: ", err)
            res.status(500).json({ message: `Error al crear la publicacion: ${err}` });
        }

        const data = await response.json()
        
        await articulo.update({
            ml_item_id: data.id
        })

        for (const variation of data.variations || []) {
            const color = variation.attribute_combinations.find(a => a.id === "COLOR")?.value_name;
            const talle = variation.attribute_combinations.find(a => a.id === "SIZE")?.value_name;

            const producto = articulo.productos.find(p => p.color === color && p.talle === talle);
            if (producto) {
                await producto.update({ ml_product_id: variation.id });
            }
        }

        res.status(201).json({ message: 'Articulo publicado con éxito', ml_item_id: data.id });
    } catch(e) {
        console.log("Error al crear la publicacion: ", e)
        res.status(500).json({ message: 'Error al crear la publicacion' });
    }
};

function buildAuthUrl() {
    return `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${process.env.ML_CLIENT_ID}&redirect_uri=${process.env.ML_REDIRECT_URI}`
}

async function getTokenMl() {
    const token = await mlTokenModel.findOne()

    // nunca se autorizó
    if (!token) return null

    // todavía válido
    if (Date.now() < token.expires_at) {
        return token.access_token
    }

    // vencido → refresh automático
    try {
        const body = new URLSearchParams({
            grant_type: "refresh_token",
            client_id: process.env.ML_CLIENT_ID,
            client_secret: process.env.ML_CLIENT_SECRET,
            refresh_token: token.refresh_token
        })

        const response = await fetch("https://api.mercadolibre.com/oauth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body
        })

        if (!response.ok) {
            return null
        }

        const data = await response.json()

        const { access_token, refresh_token, expires_in } = data

        await token.update({
            access_token,
            refresh_token,
            expires_at: Date.now() + expires_in * 1000
        })

        return access_token

    } catch (err) {
        console.error("Error refrescando token ML:", err.message)
        
        // algo se rompió → forzar nueva autorización
        await mlTokenModel.destroy({ where: {} })
        return null
    }
}

const responderWebhook = async (req, res) => {
    try {
        const data = req.body; // ML envía JSON

        // Responder rápido para que ML sepa que llegó
        res.sendStatus(200);

        // 🔹 Procesar según el topic
        if (data.topic === "orders") {
            const orderId = data.resource.split("/").pop(); // extraer id de la orden

            // Traer detalles de la orden
            const response = await fetch(`https://api.mercadolibre.com/orders/${orderId}`, {
                headers: { Authorization: `Bearer ${getTokenMl()}` }
            });
            const order = await response.json();
        
            // Recorrer cada producto de la orden
            for (const item of order.order_items) {
                const mlItemId = item.item.id;
                const mlVariationId = item.item.variation_id;
                const cantidadVendida = item.quantity;
            
                // Buscar producto en tu DB por artículo y variante
                const productoDB = await productoModel.findOne({
                    include: [{
                        model: articuloModel,
                        where: { ml_item_id: mlItemId }
                    }],
                    where: { ml_product_id: mlVariationId }
                });
            
                if (productoDB) {
                    const nuevoStock = productoDB.stock - cantidadVendida;
                    await productoModel.update({ stock: nuevoStock }, { where: { id: productoDB.id } });
                }
            }
        }
    } catch (err) {
        console.error("Error en webhook ML:", err);
        res.sendStatus(500);
    }
}


module.exports = { getFirstToken, createItem, getTokenMl, responderWebhook };