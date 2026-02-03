const { sequelize } = require("../config/dbConnect")
const { DataTypes } = require("sequelize")

const MercadoLibreToken = sequelize.define("MercadoLibreToken", {
        access_token: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        refresh_token: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        expires_at: {
            type: DataTypes.BIGINT,
            allowNull: false
        }
    }, {
    tableName: "ml_token",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
})

module.exports = MercadoLibreToken;