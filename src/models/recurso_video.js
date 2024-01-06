const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");
const Recurso = require("./recurso");
const Video = require("./video");

const recursoVideo = sequelize.define("recurso_video", {
    id_recurso:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "recurso",
            key: "id_recurso"
        }
    },
    id_video:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "video",
            key: "id_video"
        }
    }
},
{
    tableName: 'recurso_video',
    timestamps: false
});

Recurso.hasMany(recursoVideo, { foreignKey: "id_recurso", as: "recurso_video" });
recursoVideo.belongsTo(Recurso, { foreignKey: "id_recurso", as: "recurso" } );

Video.hasMany(recursoVideo, { foreignKey: "id_video", as: "recurso_video" });
recursoVideo.belongsTo(Video, { foreignKey: "id_video", as: "video" });

module.exports = recursoVideo;
