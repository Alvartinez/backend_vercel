const { Sequelize } = require("sequelize");
const { pg } = require("pg");

// const sequelize = new Sequelize(process.env.DB_NAME || "healthTrain", process.env.DB_USER || "postgres", process.env.DB_PASSWORD || "310873292As", {
//     host: "localhost",
//     port: 5432,
//     dialect: "postgres",
//     dialectModule: pg
// });

const sequelize = new Sequelize(process.env.DB_NAME || "verceldb", process.env.DB_USER || "default", process.env.DB_PASSWORD || "5BWgNImv0iOw", {
    host: "ep-raspy-water-a4kg3bn4-pooler.us-east-1.aws.neon.tech",
    port: 5432,
    dialect: "postgres",
    dialectModule: pg,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Esto deshabilita la verificación del certificado, asegúrate de entender las implicaciones de seguridad.
        }
    }
});

module.exports = sequelize;