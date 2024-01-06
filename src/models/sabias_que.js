const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");

const sabiasQue = sequelize.define("sabias_que", {
    id_sabias_que:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    titulo:{
        type: DataTypes.STRING,
        allowNull:false
    },
    enunciado:{
        type: DataTypes.STRING,
        allowNull:false
    },
    imagen:{
        type: DataTypes.STRING,
        allowNull:false
    },
    archivo:{
        type: DataTypes.STRING,
        allowNull:false
    }
},
{
    tableName: 'sabias_que',
    timestamps: false
});

module.exports = sabiasQue;