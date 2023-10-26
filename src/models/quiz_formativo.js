const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");
const Modulo = require("./modulo");

const Quiz = sequelize.define("quiz_formativo", {
    id_quiz_formativo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull:false
    },
    indicacion: {
        type: DataTypes.STRING
    },
    valor_min: {
        type: DataTypes.INTEGER,
        allowNull:false
    },
    valor_max: {
        type: DataTypes.INTEGER,
        allowNull:false
    },
    id_modulo: {
        type: DataTypes.INTEGER,
        allowNull:false,
        references: {
            model: "modulo",
            key: "id_modulo"
        }
    }
    
},{
    tableName: 'quiz_formativo',
    timestamps: false
});

Modulo.hasMany(Quiz, { foreignKey: "id_modulo", as: "quiz_formativo" });
Quiz.belongsTo(Modulo, { foreignKey: "id_modulo", as: "modulo" });

module.exports = Quiz;