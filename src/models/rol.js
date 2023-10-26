const { DataTypes } = require("sequelize");
const sequelize = require("../db/connection");

const Rol = sequelize.define("rol", {
    id_rol: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cargo: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
},{
    tableName: 'rol',
    timestamps: false
});

module.exports = Rol;