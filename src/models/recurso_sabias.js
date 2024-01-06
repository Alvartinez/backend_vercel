const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");
const Recurso = require("./recurso");
const sabiasQue = require("./sabias_que");

const recursoSabias = sequelize.define("recurso_sabias", {
    id_recurso:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "recurso",
            key: "id_recurso"
        }
    },
    id_sabias_que:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "sabias_que",
            key: "id_sabias_que"
        }
    }
},
{
    tableName: 'recurso_sabias',
    timestamps: false
});

Recurso.hasMany(recursoSabias, { foreignKey: "id_recurso", as: "recurso_sabias" });
recursoSabias.belongsTo(Recurso, { foreignKey: "id_recurso", as: "recurso" } );

sabiasQue.hasMany(recursoSabias, { foreignKey: "id_sabias_que", as: "recurso_sabias" });
recursoSabias.belongsTo(sabiasQue, { foreignKey: "id_sabias_que", as: "sabias_que" });

module.exports = recursoSabias;