const { sequelize } = require("../config/dbConnect")
const { DataTypes } = require("sequelize")
const Persona = require("./persona")

const Cliente = sequelize.define(
    "cliente",
    {
        dni: {
            type: DataTypes.STRING,
        },
        cuit_cuil: {
            type: DataTypes.STRING,
        },
        tipo_cliente: {
            type: DataTypes.ENUM('MAYORISTA', 'MINORISTA'),
            allowNull: false,
        },
        forma_de_envio: {
            type: DataTypes.STRING,
        },
        codigo_postal: {
          type: DataTypes.STRING,
        },
        ciudad: {
          type: DataTypes.STRING,
        },
        provincia: {
          type: DataTypes.STRING,
        },
      },
      {
        tableName: "cliente"
      }
)

Cliente.belongsTo(Persona, {foreignKey: "persona_id"})

module.exports = Cliente;