const { Sequelize } = require("sequelize");
const { pg } = require("pg");

// const sequelize = new Sequelize(process.env.DB_NAME || "healthTrain", process.env.DB_USER || "postgres", process.env.DB_PASSWORD || "310873292As", {
//     host: "localhost",
//     port: 5432,
//     dialect: "postgres",
//     dialectModule: pg
// });

const sequelize = new Sequelize(process.env.DB_NAME || "osl-udes", process.env.DB_USER || "postgres", process.env.DB_PASSWORD || "Jesus2023*", {
    host: "190.90.163.227",
    port: 5432,
    dialect: "postgres",
    dialectModule: pg
});

module.exports = sequelize;