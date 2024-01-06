const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");
const Modulo = require("./modulo");
const Activity = require("./actividad");

const moduloActividad = sequelize.define("modulo_actividad", {
    id_modulo:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "modulo",
            key: "id_modulo"
        }
    },
    id_actividad:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "actividad",
            key: "id_actividad"
        }
    }
},
{
    tableName: 'modulo_actividad',
    timestamps: false
});

Modulo.hasMany(moduloActividad, { foreignKey: "id_modulo", as: "modulo_actividad" });
moduloActividad.belongsTo(Modulo, { foreignKey: "id_modulo", as: "modulo" } );

Activity.hasMany(moduloActividad, { foreignKey: "id_actividad", as: "modulo_actividad" });
moduloActividad.belongsTo(Activity, { foreignKey: "id_actividad", as: "actividad" });

module.exports = moduloActividad;