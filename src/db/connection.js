const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_NAME || "healthTrain", process.env.DB_USER || "postgres", process.env.DB_PASSWORD || "310873292As", {
    host: "localhost",
    port: 5432,
    dialect: "postgres"
});

module.exports = sequelize;