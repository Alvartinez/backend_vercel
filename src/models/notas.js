const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");

const Notes = sequelize.define("notas", {
    id_notas:{
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
    imagen:{
        type: DataTypes.STRING
    }, 
    video:{
        type: DataTypes.STRING
    }, 
    archivo:{
        type: DataTypes.STRING
    }
},
{
    tableName: 'notas',
    timestamps: false
});

module.exports = Notes;