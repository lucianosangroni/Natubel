const { sequelize } = require("../config/dbConnect")
const { DataTypes } = require("sequelize")

const Cliente_O_Proveedor = sequelize.define(
    "cliente_o_proveedor",
    {
        nombre: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        dni: {
            type: DataTypes.STRING,
        },
        cuit_cuil: {
            type: DataTypes.STRING,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        telefono: {
          type: DataTypes.STRING,
        },
        tipo_cliente: {
            type: DataTypes.ENUM('MAYORISTA', 'MINORISTA'),
        },
        es_proveedor: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        forma_de_envio: {
            type: DataTypes.STRING,
        },
        direccion: {
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
        tableName: "cliente_o_proveedor"
      }
)

module.exports = Cliente_O_Proveedor;