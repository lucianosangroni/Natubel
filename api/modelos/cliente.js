const { sequelize } = require("../config/dbConnect")
const { DataTypes } = require("sequelize")
const Persona = require("./persona")

const Cliente = sequelize.define(
    "cliente",
    {
        dni: {
            type: DataTypes.STRING,
            unique: true
        },
        cuit_cuil: {
            type: DataTypes.STRING,
            unique: true
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
        flag_activo: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
      },
      {
        tableName: "cliente",
        paranoid: true,
        deletedAt: "flag_activo",
      }
)

Cliente.belongsTo(Persona, {foreignKey: "persona_id"})

module.exports = Cliente;