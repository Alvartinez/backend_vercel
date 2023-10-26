const { DataTypes } = require("sequelize");
const sequelize = require("../db/connection");

const Permiso = sequelize.define("permiso", {
    id_permiso: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        unique: true,
        allowNull:false
    },
    descripcion: {
        type: DataTypes.STRING,
        unique: true,
        allowNull:false
    },
    disponible: {
        type: DataTypes.BOOLEAN,
        allowNull:false
    }    
},{
    tableName: 'permiso',
    timestamps: false
});

module.exports = Permiso;