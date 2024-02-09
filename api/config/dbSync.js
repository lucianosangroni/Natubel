const { sequelize } = require("../config/dbConnect")

const dbSync = async() => {
    try {
        await sequelize.sync( { force: true } );
        console.log("Modelos sincronizados correctamente");
    } catch(e){
        console.log("Error al sincronizar modelos: ", e)
    }
};

module.exports = { dbSync }