const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");

const lineaTiempo = sequelize.define("linea_tiempo", {
    id_linea_tiempo:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo:{
        type: DataTypes.STRING,
        unique: true,
        allowNull:false
    }
},
{
    tableName: 'linea_tiempo',
    timestamps: false
});

module.exports = lineaTiempo;