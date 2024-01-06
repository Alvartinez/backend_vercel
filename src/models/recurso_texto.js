const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");
const Recurso = require("./recurso");
const textoPlano = require("./texto_plano");

const recursoTexto = sequelize.define("recurso_texto", {
    id_recurso:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "recurso",
            key: "id_recurso"
        }
    },
    id_texto_plano:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "texto_plano",
            key: "id_texto_plano"
        }
    }
},
{
    tableName: 'recurso_texto',
    timestamps: false
});

Recurso.hasMany(recursoTexto, { foreignKey: "id_recurso", as: "recurso_texto" });
recursoTexto.belongsTo(Recurso, { foreignKey: "id_recurso", as: "recurso" } );

textoPlano.hasMany(recursoTexto, { foreignKey: "id_texto_plano", as: "recurso_texto" });
recursoTexto.belongsTo(textoPlano, { foreignKey: "id_texto_plano", as: "texto_plano" });

module.exports = recursoTexto;