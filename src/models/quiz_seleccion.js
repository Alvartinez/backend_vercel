const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");
const Quiz = require("./quiz_formativo");
const Select = require("./seleccion");

const QuizSelection = sequelize.define("quiz_seleccion", {
    id_quiz_formativo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: "quiz_formativo",
            key: "id_quiz_formativo"
        }
    },
    id_seleccion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: "seleccion",
            key: "id_seleccion"
        }
    }
},{
    tableName: 'quiz_seleccion',
    timestamps: false
});

Select.hasMany(QuizSelection, { foreignKey: "id_seleccion", as: "quiz_seleccion" });
QuizSelection.belongsTo(Select, { foreignKey: "id_seleccion", as: "seleccion" })

Quiz.hasMany(QuizSelection, { foreignKey: "id_quiz_formativo", as: "quiz_seleccion" });
QuizSelection.belongsTo(Quiz, { foreignKey: "id_quiz_formativo", as: "quiz_formativo" });

module.exports = QuizSelection;