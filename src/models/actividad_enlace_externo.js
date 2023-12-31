const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");
const Activity = require("./actividad");
const Enlace = require("./enlace_externo");

const actividadEnlace = sequelize.define("actividad_enlace", {
    id_actividad:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "actividad",
            key: "id_actividad"
        }
    },
    id_enlace_externo:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "enlace_externo",
            key: "id_enlace_externo"
        }
    }
},
{
    tableName: 'actividad_enlace',
    timestamps: false
});

Activity.hasMany(actividadEnlace, { foreignKey: "id_actividad", as: "actividad_enlace" });
actividadEnlace.belongsTo(Activity, { foreignKey: "id_actividad", as: "actividad" });

Enlace.hasMany(actividadEnlace, { foreignKey: "id_enlace_externo", as: "actividad_enlace" });
actividadEnlace.belongsTo(Enlace, { foreignKey: "id_enlace_externo", as: "enlace_externo" });

module.exports = actividadEnlace;