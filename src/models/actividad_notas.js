const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");
const Activity = require("./actividad");
const Notes = require("./notas");

const actividadNotas = sequelize.define("actividad_notas", {
    id_actividad:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "actividad",
            key: "id_actividad"
        }
    },
    id_notas:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "notas",
            key: "id_notas"
        }
    }
},
{
    tableName: 'actividad_notas',
    timestamps: false
});

Activity.hasMany(actividadNotas, { foreignKey: "id_actividad", as: "actividad_notas" });
actividadNotas.belongsTo(Activity, { foreignKey: "id_actividad", as: "actividad" });

Notes.hasMany(actividadNotas, { foreignKey: "id_notas", as: "actividad_notas" });
actividadNotas.belongsTo(Notes, { foreignKey: "id_notas", as: "notas" });

module.exports = actividadNotas;