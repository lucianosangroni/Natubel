const { Sequelize } = require("sequelize")

const database = process.env.MYSQL_DATABASE
const username = process.env.MYSQL_USUARIO
const password = process.env.MYSQL_CONTRASENA
const host = process.env.MYSQL_HOST

const sequelize = new Sequelize(
    database,
    username,
    password,
    {
        host,
        dialect:"mysql",
        timezone: '-03:00',
    }
)

const dbConnect = async() => {
    try{
        await sequelize.authenticate()
        console.log("MYSQL Inicio Conexion")
    }catch(e){
        console.log("MYSQL Error de Conexion: ", e)
    }
};

module.exports = { sequelize, dbConnect }