const express = require("express");
const cors = require("cors");
const routesCourse = require("../routers/curso");
const routesPersona = require("../routers/persona");
const routesAuth = require("../routers/auth");
const routesModule = require('../routers/module');
const routesQuiz = require('../routers/quiz');
const sequelize = require("../db/connection");
const routesEvaluacion = require("../routers/evaluacion");
const routesText = require("../routers/texto_plano");

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT || "3006";   
        this.listen();
        this.middlewares();
        this.routers();
        this.dbConnect();
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log("Aplicación corriendo " + this.port);
        });    
    }

    routers() {
        this.app.use("/api/cursos", routesCourse),
        this.app.use("/api/personas", routesPersona),
        this.app.use("/api/auth", routesAuth),
        this.app.use("/api/module", routesModule),
        this.app.use("/api/quiz", routesQuiz),
        this.app.use("/api/evaluacion", routesEvaluacion),
        this.app.use("/api/texto", routesText)
    }

    middlewares() {
        //Paseo body
        this.app.use(express.json());

        //Cors
        this.app.use(cors());
    }

    async dbConnect() {
        try {
            await sequelize.authenticate();
            console.log("Connection has been established successfully.")
        } catch (error) {
            console.error("Unable to connect to the database ", error);
        }
    }
}

module.exports = Server;