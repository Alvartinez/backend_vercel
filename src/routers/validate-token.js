const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
    const headerToken = req.headers["authorization"]

    if (headerToken != undefined && headerToken.startsWith("Bearer ")) {
        //TOKEN
        try {

            const bearerToken = headerToken.slice(7);
    
            jwt.verify(bearerToken, process.env.PASSWORD_KEY || "Magic Secret");
            
            next(); 
            
        } catch (error) {
            res.status(401).json({
                msg: "Token no válido"
            });
        }

    } else {
        res.status(401).json({
            msg: "Acceso Denegado"
        });
    }
}

module.exports = validateToken;