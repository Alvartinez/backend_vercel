const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");

const Enlace = sequelize.define("enlace_externo", {
    id_enlace_externo:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, 
    titulo:{
        type: DataTypes.STRING
    }, 
    enlace:{
        type: DataTypes.STRING,
        allowNull:false
    }
}, 
{
    tableName: 'enlace_externo',
    timestamps: false
});

module.exports = Enlace;