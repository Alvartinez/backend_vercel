const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");
const Activity = require("./actividad");
const Tarea = require("./tarea");

const actividadTarea = sequelize.define("actividad_tarea", {
    id_actividad:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "actividad",
            key: "id_actividad"
        }
    },
    id_tarea:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "tarea",
            key: "id_tarea"
        }
    }
},
{
    tableName: 'actividad_tarea',
    timestamps: false
});

Activity.hasMany(actividadTarea, { foreignKey: "id_actividad", as: "actividad_tarea" });
actividadTarea.belongsTo(Activity, { foreignKey: "id_actividad", as: "actividad" });

Tarea.hasMany(actividadTarea, { foreignKey: "id_tarea", as: "actividad_tarea" });
actividadTarea.belongsTo(Tarea, { foreignKey: "id_tarea", as: "tarea" });

module.exports = actividadTarea;