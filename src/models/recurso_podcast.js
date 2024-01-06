const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");
const Recurso = require("./recurso");
const Podcast = require("./podcast");

const recursoPodcast = sequelize.define("recurso_podcast", {
    id_recurso:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "recurso",
            key: "id_recurso"
        }
    },
    id_podcast:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "podcast",
            key: "id_podcast"
        }
    }
},
{
    tableName: 'recurso_podcast',
    timestamps: false
});

Recurso.hasMany(recursoPodcast, { foreignKey: "id_recurso", as: "recurso_podcast" });
recursoPodcast.belongsTo(Recurso, { foreignKey: "id_recurso", as: "recurso" } );

Podcast.hasMany(recursoPodcast, { foreignKey: "id_podcast", as: "recurso_podcast" });
recursoPodcast.belongsTo(Podcast, { foreignKey: "id_podcast", as: "poscast" });

module.exports = recursoPodcast;