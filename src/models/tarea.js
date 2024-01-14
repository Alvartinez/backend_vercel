const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");

const Tarea = sequelize.define("tarea", {
    id_tarea:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, 
    nombre:{
        type: DataTypes.STRING,
        allowNull:false
    }, 
    indicacion:{
        type: DataTypes.STRING,
        allowNull:false
    }, 
    archivo:{
        type: DataTypes.STRING
    }, 
    texto:{
        type: DataTypes.STRING
    }
},
{
    tableName: 'tarea',
    timestamps: false
});

module.exports = Tarea;