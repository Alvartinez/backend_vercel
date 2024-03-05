const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");

const sabiasQue = sequelize.define("sabias_que", {
    id_sabias_que:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    titulo:{
        type: DataTypes.TEXT,
        allowNull:false
    },
    enunciado:{
        type: DataTypes.TEXT
    },
    imagen:{
        type: DataTypes.TEXT
    },
    archivo:{
        type: DataTypes.TEXT
    }
},
{
    tableName: 'sabias_que',
    timestamps: false
});

module.exports = sabiasQue;