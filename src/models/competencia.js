const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");

const Competence = sequelize.define("competencia", {
    id_competencia:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, 
    competencia:{
        type: DataTypes.JSON,
        allowNull:false
    }
}, 
{
    tableName: 'competencia',
    timestamps: false
});

module.exports = Competence;