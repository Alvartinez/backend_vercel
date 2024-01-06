const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");

const Video = sequelize.define("video", {
    id_video:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre:{
        type: DataTypes.STRING
    },
    video:{
        type: DataTypes.STRING,
        allowNull:false
    }
}, 
{
    tableName: 'video',
    timestamps: false
});

module.exports = Video;