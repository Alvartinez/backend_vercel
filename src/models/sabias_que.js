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
        type: DataTypes.STRING
    },
    imagen:{
        type: DataTypes.STRING
    },
    archivo:{
        type: DataTypes.STRING
    }
},
{
    tableName: 'sabias_que',
    timestamps: false
});

module.exports = sabiasQue;