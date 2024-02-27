const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");
const lineaTiempo = require("./linea_tiempo");

const Hito = sequelize.define("hito", {
    id_hito:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_linea_tiempo:{
        type: DataTypes.INTEGER,
        references: {
            model: "linea_tiempo",
            key: "id_linea_tiempo"
        }
    },
    titulo:{
        type: DataTypes.STRING,
        allowNull:false
    },
    descripcion:{
        type: DataTypes.STRING,
        allowNull:false
    },
    imagen:{
        type: DataTypes.STRING
    },
    archivo:{
        type: DataTypes.STRING
    },
    enlace:{
        type: DataTypes.STRING
    },
    fecha:{
        type: DataTypes.TEXT,
        allowNull:false
    }
},
{
    tableName: 'hito',
    timestamps: false
});

lineaTiempo.hasMany(Hito, { foreignKey: "id_linea_tiempo", as: "hito" });
Hito.belongsTo(lineaTiempo, { foreignKey: "id_linea_tiempo", as: "linea_tiempo" });

module.exports = Hito;