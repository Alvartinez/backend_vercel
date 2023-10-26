const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");
const Select = require("./seleccion");
const Evaluation = require("./evaluacion");

const SelectEvaluation = sequelize.define("evaluacion_seleccion", {
    id_evaluacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "evaluacion",
            key: "id_evaluacion"
        }
    },
    id_seleccion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "seleccion",
            key: "id_seleccion"
        }
    }

},{
    tableName: 'evaluacion_seleccion',
    timestamps: false
});

Evaluation.hasMany(SelectEvaluation, { foreignKey: "id_evaluacion", as: "evaluacion_seleccion" });
SelectEvaluation.belongsTo(Evaluation, { foreignKey: "id_evaluacion", as: "evaluacion" } );

Select.hasMany(SelectEvaluation, { foreignKey: "id_seleccion", as: "evaluacion_seleccion" });
SelectEvaluation.belongsTo(Select, { foreignKey: "id_seleccion", as: "seleccion" });

module.exports = SelectEvaluation;