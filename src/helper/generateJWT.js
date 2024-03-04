const jwt = require("jsonwebtoken");

const generateJWT = async (id_persona = "", id_usuario = "", username = "", rol = "") => {
  const payload = { id_persona, id_usuario, username, rol };

  const token = jwt.sign(
      payload,
      process.env.PASSWORD_KEY || "Magic Secret",
      {
        expiresIn: "24h"
      }
  );

  if(!token){
    return "No se pudo generar el token";
  }

  return token;

};

module.exports = generateJWT;