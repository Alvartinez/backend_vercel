const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");

const Match = sequelize.define("empareja", {
    id_empareja: {
        type: DataTypes.INTEGER,
        allowNull:false,
        primaryKey: true,
        autoIncrement: true
    },
    enunciado: {
        type: DataTypes.STRING,
        allowNull:false
    },
    pareja:{
        type: DataTypes.JSON,
        allowNull: false
    },
    puntaje:{
        type: DataTypes.FLOAT, // Cambiado a FLOAT en lugar de NUMBER
        allowNull: false
    }
},{
    tableName: 'empareja',
    timestamps: false
});

module.exports = Match;