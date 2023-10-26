const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");

const Select = sequelize.define("seleccion", {
    id_seleccion: {
        type: DataTypes.INTEGER,
        allowNull:false,
        primaryKey: true,
        autoIncrement: true
    },
    enunciado: {
        type: DataTypes.STRING,
        allowNull:false
    },
    multiple:{
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    seleccion:{
        type: DataTypes.JSON,
        allowNull: false
    },
    puntaje:{
        type: DataTypes.FLOAT, // Cambiado a FLOAT en lugar de NUMBER
        allowNull: false
    }
},{
    tableName: 'seleccion',
    timestamps: false
});

module.exports = Select;