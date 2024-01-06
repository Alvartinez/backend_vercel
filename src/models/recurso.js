const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");

const Recurso = sequelize.define("recurso", {
    id_recurso:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre:{
        type: DataTypes.STRING,
        unique: true,
        allowNull:false
    }
},
{
    tableName: 'recurso',
    timestamps: false
});

module.exports = Recurso;