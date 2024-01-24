const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");
const Course = require("./curso");
const Competence = require("./competencia");

const comptCourse = sequelize.define("curso_competencia", {
    id_curso:{
        type: DataTypes.INTEGER,
        allowNull:false,
        primaryKey: true,
        references: {
            model: "curso",
            key: "id_curso"
        }
    }, 
    id_competencia:{
        type: DataTypes.STRING,
        allowNull:false,
        primaryKey: true,
        references: {
            model: "competencia",
            key: "id_competencia"
        }
    }
}, 
{
    tableName: 'curso_competencia',
    timestamps: false
});


Course.hasMany(comptCourse, { foreignKey: "id_curso", as: "curso_competencia" });
comptCourse.belongsTo(Course, { foreignKey: "id_curso", as: "curso" });

Competence.hasMany(comptCourse, { foreignKey: "id_competencia", as: "curso_competencia" });
comptCourse.belongsTo(Competence, { foreignKey: "id_competencia", as: "competencia" });

module.exports = comptCourse;