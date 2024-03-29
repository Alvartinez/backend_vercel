const { Sequelize } = require("sequelize");
const { pg } = require("pg");

const sequelize = new Sequelize(process.env.DB_NAME || "osl-udes", process.env.DB_USER || "postgres", process.env.DB_PASSWORD || "310873292As", {
    host: "localhost",
    port: 5432,
    dialect: "postgres",
    dialectModule: pg
});

// const sequelize = new Sequelize(process.env.DB_NAME || "verceldb", process.env.DB_USER || "default", process.env.DB_PASSWORD || "Kpgoe0Vq8OUv", {
//     host: "ep-shrill-haze-39862407-pooler.us-east-1.aws.neon.tech",
//     port: 5432,
//     dialect: "postgres",
//     dialectModule: pg,
//     dialectOptions: {
//         ssl: {
//             require: true,
//             rejectUnauthorized: false // Esto deshabilita la verificación del certificado, asegúrate de entender las implicaciones de seguridad.
//         }
//     }
// });

module.exports = sequelize;