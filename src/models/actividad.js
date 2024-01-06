const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");

const Activity = sequelize.define("actividad", {
    id_actividad:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, 
    nombre:{
        type: DataTypes.STRING,
        allowNull:false
    }
}, 
{
    tableName: 'actividad',
    timestamps: false
});

module.exports = Activity;