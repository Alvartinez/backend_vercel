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
    texto:{
        type: DataTypes.STRING,
        allowNull:false
    }, 
    archivo:{
        type: DataTypes.STRING,
        allowNull:false
    }
},
{
    tableName: 'tarea',
    timestamps: false
});

module.exports = Tarea;