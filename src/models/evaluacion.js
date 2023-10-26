const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");
const Course = require("./curso");

const Evaluation = sequelize.define("evaluacion", {
    id_evaluacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        unique: true,
        allowNull:false
    },
    valor_min: {
        type: DataTypes.INTEGER,
        allowNull:false
    },
    valor_max: {
        type: DataTypes.INTEGER,
        allowNull:false
    },
    id_curso: {
        type: DataTypes.INTEGER,
        allowNull:false,
        references: {
            model: "curso",
            key: "id_curso"
        }
    },
    indicacion: {
        type: DataTypes.STRING,
        allowNull:false
    },
    objetivo: {
        type: DataTypes.STRING,
        allowNull:false
    },
    intentos: {
        type: DataTypes.INTEGER
    }

},{
    tableName: 'evaluacion',
    timestamps: false
});

Course.hasOne(Evaluation, { foreignKey: "id_curso", as: "evaluacion" });
Evaluation.belongsTo(Course, { foreignKey: "id_curso", as: "curso"  });

module.exports = Evaluation;