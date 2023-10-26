const dotenv = require("dotenv");
const Server = require("./src/models/server");

// Configuración dotenv
dotenv.config();

const server = new Server();