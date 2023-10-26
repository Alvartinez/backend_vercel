const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");
const Course = require("./curso");
const Modulo = require("./modulo");

const CourseModule = sequelize.define("curso_modulo", {
    id_curso: {
        type: DataTypes.INTEGER,
        allowNull:false,
        primaryKey: true,
        references: {
            model: "curso",
            key: "id_curso"
        }
    },
    id_modulo: {
        type: DataTypes.INTEGER,
        allowNull:false,
        primaryKey: true,
        references: {
            model: "modulo",
            key: "id_modulo"
        }
    }
},{
    tableName: 'curso_modulo',
    timestamps: false
});

Course.hasMany(CourseModule, { foreignKey: "id_curso", as: "curso_modulo" });
CourseModule.belongsTo(Course, { foreignKey: "id_curso", as: "curso" });

Modulo.hasMany(CourseModule, { foreignKey: "id_modulo", as: "curso_modulo" });
CourseModule.belongsTo(Modulo, { foreignKey: "id_modulo", as: "modulo" });

module.exports = CourseModule;