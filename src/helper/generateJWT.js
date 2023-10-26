const jwt = require("jsonwebtoken");

const generateJWT = async (id = "", username = "", rol = "") => {
  const payload = { id, username, rol };

  const token = jwt.sign(
      payload,
      process.env.PASSWORD_KEY || "Magic Secret",
      {
        expiresIn: "4h"
      }
  );

  if(!token){
    return "No se pudo generar el token";
  }

  return token;

};

module.exports = generateJWT;