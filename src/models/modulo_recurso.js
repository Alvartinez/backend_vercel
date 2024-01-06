const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");
const Modulo = require("./modulo");
const Recurso = require("./recurso");

const moduloRecurso = sequelize.define("modulo_recurso", {
    id_modulo:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "modulo",
            key: "id_modulo"
        }
    },
    id_recurso:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "recurso",
            key: "id_recurso"
        }
    }
},
{
    tableName: 'modulo_recurso',
    timestamps: false
});

Modulo.hasMany(moduloRecurso, { foreignKey: "id_modulo", as: "modulo_recurso" });
moduloRecurso.belongsTo(Modulo, { foreignKey: "id_modulo", as: "modulo" } );

Recurso.hasMany(moduloRecurso, { foreignKey: "id_recurso", as: "modulo_recurso" });
moduloRecurso.belongsTo(Recurso, { foreignKey: "id_recurso", as: "recurso" });

module.exports = moduloRecurso;