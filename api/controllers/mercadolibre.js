const { articuloModel, productoModel, mlTokenModel, imagenModel, marcaModel } = require("../modelos");

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

const getCategoria = async (req, res) => {
    try {
        const filtro = req.query.filtro

        const tokenML = await getTokenMl()

        const response = await fetch(`https://api.mercadolibre.com/sites/MLA/domain_discovery/search?q=${filtro}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenML}`
            },
        })

        if (!response.ok) {
            const err = await response.text()
            console.log("Error al buscar la categoria: ", err)
            return res.status(500).json({ message: `Error al buscar la categoria: ${err}` });
        }

        const data = await response.json()

        res.status(200).json({ catOptions: data });
    } catch(e) {
        console.log("Error al buscar la categoria: ", e)
        res.status(500).json({ message: 'Error al buscar la categoria' });
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

        const { dominio, categoria, atributos } = req.body

        const articulo = await articuloModel.findByPk(articulo_id, {
            include: [
                { model: productoModel },
                { model: marcaModel }
            ]
        })

        if(!articulo){
            return res.status(404).json({ message: 'Articulo no encontrado' });
        }

        const domainId = dominio.replace("MLA-", "");

        const chartsResponse = await fetch("https://api.mercadolibre.com/catalog/charts/search?offset=0&limit=1", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenML}`
            },
            body: JSON.stringify({
                domain_id: domainId,
                site_id: "MLA",
                seller_id: 644556826,
                attributes: [
                    {
                        id: "GENDER",
                        values: [{ name: atributos.find(a => a.id === "GENDER")?.value_name }]
                    },
                    {
                        id: "BRAND",
                        values: [{ name: atributos.find(a => a.id === "BRAND")?.value_name }]
                    }
                ]
            })
        });

        let chart = null

        if (chartsResponse.ok) {
            const chartsData = await chartsResponse.json()
            chart = chartsData.charts?.[0];
        }

        const imagenes = await imagenModel.findAll({
            where: { articulo_id: articulo.id }
        });
        const pictures = imagenes.map(img => ({ source: img.url }));

        let ml_item_id_data = null

        const normalize = (str) => str?.toLowerCase().trim();

        for (const p of articulo.productos) {
            const atributosFinales = [
                ...atributos,
                { id: "COLOR", value_name: p.color },
                { id: 'SELLER_PACKAGE_HEIGHT', value_name: '15 cm' },
                { id: 'SELLER_PACKAGE_WIDTH',  value_name: '15 cm' },
                { id: 'SELLER_PACKAGE_LENGTH', value_name: '15 cm' },
                { id: 'SELLER_PACKAGE_WEIGHT', value_name: '500 g' },
                { id: "EMPTY_GTIN_REASON", value_name: "El producto no tiene código registrado" },
            ];

            if (chart) {
                const row = chart?.rows?.find(r => r.attributes?.some(a => a.id === "SIZE" && a.values?.some(v => normalize(v.name) === normalize(p.talle)) || a.id === "FILTRABLE_SIZE" && a.values?.some(v => normalize(v.name) === normalize(p.talle))));
            
                if (chart?.id && row?.id) {
                    atributosFinales.push({ id: "SIZE_GRID_ID", value_name: String(chart.id) });
                    atributosFinales.push({ id: "SIZE_GRID_ROW_ID", value_name: String(row.id) });

                    const sizeAttr = row.attributes.find(a => a.id === "SIZE");
                    const gridTalle = sizeAttr?.values?.[0]?.name;
                    atributosFinales.push({ id: "SIZE", value_name: gridTalle })
                } else {
                    atributosFinales.push({ id: "SIZE", value_name: p.talle })
                }
            } else {
                atributosFinales.push({ id: "SIZE", value_name: p.talle })
            }

            const body = {
                family_name: "Producto temporal - No Comprar - articulo " + articulo.numero_articulo,
                category_id: categoria,
                site_id: "MLA",
                currency_id: "ARS",
                buying_mode: "buy_it_now",
                listing_type_id: "gold_special",
                condition: "new",
                available_quantity: p.stock >= 0 ? p.stock : 0,
                price: articulo.precio_ml,

                pictures,

                attributes: atributosFinales
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
                return res.status(500).json({ message: `Error al crear la publicacion: ${err}`, body: body });
            }

            const data = await response.json()

            ml_item_id_data = data.family_id

            await p.update({ ml_product_id: data.id });
        }

        await articulo.update({ml_item_id: ml_item_id_data})

        res.status(201).json({ message: 'Articulo publicado con éxito', ml_item_id: ml_item_id_data });
    } catch(e) {
        console.log("Error al crear la publicacion: ", e)
        res.status(500).json({message: e.message});
    }
};

const desvincularItem = async (req, res) => {
    try {
        const articulo_id = req.params.id

        const articulo = await articuloModel.findByPk(articulo_id, {
            include: [
                { model: productoModel }
            ]
        })

        if(!articulo){
            return res.status(404).json({ message: 'Articulo no encontrado' });
        }

        for (const p of articulo.productos) {
            await p.update({ ml_product_id: null });
        }

        await articulo.update({ml_item_id: null})

        res.status(201).json({ message: 'Articulo desvinculado con éxito' });
    } catch(e) {
        console.log("Error al crear la publicacion: ", e)
        res.status(500).json({ message: 'Error al desvincular la publicacion' });
    }
}

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
                // Buscar producto en tu DB por artículo y variante
                const productoDB = await productoModel.findOne({
                    where: { ml_product_id: item.item.id }
                });
            
                if (productoDB) {
                    const nuevoStock = productoDB.stock - item.quantity;
                    await productoModel.update({ stock: nuevoStock }, { where: { id: productoDB.id } });
                }
            }
        }
    } catch (err) {
        console.error("Error en webhook ML:", err);
        res.sendStatus(500);
    }
}

module.exports = { getFirstToken, getCategoria, createItem, desvincularItem, getTokenMl, responderWebhook };