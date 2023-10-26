const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");
const Evaluation = require("./evaluacion");
const Person = require("./persona");

const ResponseEvaluation = sequelize.define("respuesta_evaluacion", {
    id_respuesta_evaluacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_persona: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "persona",
            key: "id_persona"
        }
    }, 
    id_evaluacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "evaluacion",
            key: "id_evaluacion"
        }
    },
    respuestas: {
        type: DataTypes.JSON,
        allowNull: false
    },
    intentos: {
        type: DataTypes.INTEGER
    }

},{
    tableName: 'respuesta_evaluacion',
    timestamps: false
});

Person.hasMany(ResponseEvaluation, { foreignKey: "id_persona", as: "respuesta_evaluacion" });
ResponseEvaluation.belongsTo(Person, { foreignKey: "id_persona", as: "persona" });

Evaluation.hasMany(ResponseEvaluation, { foreignKey: "id_evaluacion", as: "respuesta_evaluacion" });
ResponseEvaluation.belongsTo(Evaluation, { foreignKey: "id_evaluacion", as: "evaluacion" });

module.exports = ResponseEvaluation;