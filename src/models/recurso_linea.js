const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");
const Recurso = require("./recurso");
const lineaTiempo = require("./linea_tiempo");

const recursoLinea = sequelize.define("recurso_linea", {
    id_recurso:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "recurso",
            key: "id_recurso"
        }
    },
    id_linea_tiempo:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "linea_tiempo",
            key: "id_linea_tiempo"
        }
    }
},
{
    tableName: 'recurso_linea',
    timestamps: false
});

Recurso.hasMany(recursoLinea, { foreignKey: "id_recurso", as: "recurso_linea" });
recursoLinea.belongsTo(Recurso, { foreignKey: "id_recurso", as: "recurso" } );

lineaTiempo.hasMany(recursoLinea, { foreignKey: "id_linea_tiempo", as: "recurso_linea" });
recursoLinea.belongsTo(lineaTiempo, { foreignKey: "id_linea_tiempo", as: "linea_tiempo" });

module.exports = recursoLinea;