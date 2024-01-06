const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");

const Podcast = sequelize.define("podcast", {
    id_podcast:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre:{
        type: DataTypes.STRING
    },
    link_podcast:{
        type: DataTypes.STRING,
        allowNull:false
    }
}, 
{
    tableName: 'podcast',
    timestamps: false
});

module.exports = Podcast;