const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");

const Modulo = sequelize.define("modulo", {
    id_modulo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull:false
    },
    descripcion:{
        type: DataTypes.STRING,
        allowNull:false
    },
    objetivo:{
        type: DataTypes.STRING,
        allowNull:false
    },
    conclusion:{
        type: DataTypes.STRING,
        allowNull:false
    },
    portada:{
        type: DataTypes.STRING,
        allowNull:false
    },
    creadores:{
        type: DataTypes.JSON
    }, 
    competencias:{
        type: DataTypes.JSON,
        allowNull:false
    },
    duracion:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    temas:{
        type: DataTypes.JSON,
        allowNull:false
    }
},{
    tableName: 'modulo',
    timestamps: false
});

module.exports = Modulo;