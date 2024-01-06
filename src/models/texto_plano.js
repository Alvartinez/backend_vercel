const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");

const textoPlano = sequelize.define("texto_plano", {
    id_texto_plano:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo:{
        type: DataTypes.STRING,
        allowNull:false
    },
    parrafo:{
        type: DataTypes.STRING
    },
    imagen:{
        type: DataTypes.STRING
    },
    archivo:{
        type: DataTypes.STRING
    },
    subtitulo:{
        type: DataTypes.STRING
    }
},
{
    tableName: 'texto_plano',
    timestamps: false
});

module.exports = textoPlano;