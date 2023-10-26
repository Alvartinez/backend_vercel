const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");
const Match = require("./empareja");
const Evaluation = require("./evaluacion");

const MatchEvaluation = sequelize.define("evaluacion_empareja", {
    id_evaluacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "evaluacion",
            key: "id_evaluacion"
        }
    },
    id_empareja: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "empareja",
            key: "id_empareja"
        }
    }

},{
    tableName: 'evaluacion_empareja',
    timestamps: false
});

Evaluation.hasMany(MatchEvaluation, { foreignKey: "id_evaluacion", as: "evaluacion_empareja" });
MatchEvaluation.belongsTo(Evaluation, { foreignKey: "id_evaluacion", as: "evaluacion" } );

Match.hasMany(MatchEvaluation, { foreignKey: "id_empareja", as: "evaluacion_empareja" });
MatchEvaluation.belongsTo(Match, { foreignKey: "id_empareja", as: "empareja" });

module.exports = MatchEvaluation;