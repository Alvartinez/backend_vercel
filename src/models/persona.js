const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");

const Person = sequelize.define("persona", {
    id_persona: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull:false
    },
    fecha_registro: {
        type: DataTypes.DATE,
        allowNull:false
    },
    portada: {
        type: DataTypes.TEXT
    }
},{
    tableName: 'persona',
    timestamps: false
});

module.exports = Person;