const bcrypt = require("bcrypt");
const Person = require("../models/persona");
const jwt = require("jsonwebtoken");
const generateJWT = require("../helper/generateJWT");
const User = require("../models/user");
const Rol = require("../models/rol");
const { QueryTypes } = require('sequelize'); 
const sequelize = require("../db/connection");

// El usuario inicia sesión
const LoginPersona = async (req, res) => { 

    const { username, password } = req.body;
    
    try { 

        // Buscar el usuario por su username
        const user = await User.findOne({
            where: { username: username },
            include: [
                { model: Person, as: "persona" },
                { model: Rol, as: "rol" }
            ]
        });

        if (!user) {
            return res.status(400).json({
                msg: "El usuario no existe, verifique el username o contraseña"
            });
        }
  
        // Valida el password
        const passwordValid = await bcrypt.compare(password, user.password);
    
        if (!passwordValid) {
            return res.status(400).json({
                msg: "username o contraseña no válida"
            });
        }
  
        if (!user.persona.estado) {
            console.log("Estado Desactivado");
            return res.status(400).json({
                msg: user.persona.nombre+" no se encuentra activo, comuníquese con el ADMIN"
            });
        }
        const id = user.persona.id_persona;
  
        const rol = user.rol.cargo;
  
        // Se genera el token
        const token = await generateJWT(id, username, rol); 

        // Redirigir según los roles
        if (rol === "Aprendiz") {
            return res.status(200).json({
                msg: "Login exitoso",
                token: token,
                redirectTo: "user-home"
            });
        } else if (rol === "Docente") {
            return res.status(200).json({
                msg: "Login exitoso",
                token: token,
                redirectTo: "doc-home"
            });
        } else if (rol === "Admin") {
            return res.status(200).json({
                msg: "Login exitoso",
                token: token,
                redirectTo: "admin-home"
            });
        } else if (rol === "Visitante"){
            return res.status(200).json({
                msg: "Login exitoso",
                token: token,
                redirectTo: "vist-home"
            });
        }
  
        // Si no se encuentra un rol válido para redirección, mostrar un mensaje de error
        return res.status(400).json({
            msg: "Usuario sin rol válido para redirección"
        });
      
    } catch (error) {
        console.error("Error:", error);
        res.status(400).json({
            msg: "¡Ha ocurrido un error!",
        });
    }
}

const getPeopleWithCourses = async (req, res) => { 
    try {

        const listPeopleWithCourses = await sequelize.query(`
            SELECT
                p.id_persona,
                p.nombre,
                p.email,
                p.estado,
                p.fecha_registro,
                JSON_AGG(
                    json_build_object(
                        'id_curso', c.id_curso,
                        'nombre_curso', c.nombre,
                        'fecha_inscripcion', i.fecha_inscripcion
                    )
                ) as cursos
            FROM
                persona p
            INNER JOIN
                inscrito i ON p.id_persona = i.id_persona
            INNER JOIN
                curso c ON i.id_curso = c.id_curso
            GROUP BY
                p.id_persona;
        `, { type: QueryTypes.SELECT });

        res.json({ listPeopleWithCourses });
    } catch (error) {
        console.error("Error:", error);
        res.status(400).json({
            msg: "¡Ha ocurrido un error!",
        });
    }
}

// Cambiar el rol de visitante a aprendiz
const changeRole = async (req, res) => {

    const { id, rol } = req.body;
  
    try {
  
      const user = await User.findOne({ where: { id_persona: id } });
  
      if (!user) {
          return res.status(400).json({
              msg: "Usuario no encontrado"
          });
      }
  
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();
      const dateStr = `${year}-${month}-${day}`;
  
      await User.update(
        { id_rol: 2 },
        { where: { id_persona: user.id_persona } }
      );
  
      const newToken = await generateJWT(id, user.username, rol);
  
      console.log(newToken);
  
      return res.status(200).json({ newToken });
  
    } catch (error) {
      return res.status(400).json({
        msg: '¡Ha ocurrido un error!'
      });
    }
  
}

// Si el usuario está inscrito
const isRegisteredCourse = async (req, res) => {

    const idCurso = req.params.idCurso;
    const idPersona = req.params.idPersona;

    console.log("id Curso: "+idCurso+", id Persona: "+idPersona);
  
    try {
  
      let isRegistered = false;
  
      const inscripcion = await Inscrito.findOne(
        {
          where:
          {
            id_persona: idPersona,
            id_curso: idCurso
          }
        }
      );

      console.log(inscripcion);
  
      if (!inscripcion) {
        return res.status(200).json(isRegistered); // Retorna false si no está inscrito
      }
  
      isRegistered = true;
  
      return res.status(200).json(isRegistered); // Retorna true si está inscrito
  
    } catch (error) {
      return res.status(400).json({
        msg: '¡Ha ocurrido un error!'
      });
    }
  
}

// Información de inscritos
const usersRegisteredCourses = async (req, res) => {
  
    try {
  
      const inscritos = await Inscrito.findAll({
        include:[
          { 
            model: Person, 
            as: 'persona'
          }
        ]
      });
  
      if(!inscritos){
        res.status(400).json({
          msg: "Se ha ocurrido, consulta al Admin"
        });
      }
  
      res.json(inscritos);
  
    } catch (error) {
      return res.status(400).json({
        msg: '¡Ha ocurrido un error!'
      });
    }
  
}

// El usuario se registra en un curso
const registeredCourse = async (req, res) => {
  
    const { idCurso, idPersona } = req.body;
  
    try {
  
      const inscripcion = await Inscrito.findOne(
        { 
          where: 
          { 
            id_persona: idPersona,
            id_curso: idCurso 
          }
        }
      );
      
      if(inscripcion){
        return res.status(400).json({
          msg: 'Ya se encuentra registrado'
        });
      }
  
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();
      const dateStr = `${year}-${month}-${day}`;
  
      await Inscrito.create({
        id_curso: idCurso,
        fecha_inscripcion: dateStr,
        id_persona: idPersona
      });
  
      return res.status(200).json({
        msg: "Inscripción exitosa"
      });
  
    } catch (error) {
      return res.status(400).json({
        msg: '¡Ha ocurrido un error!'
      });
    }
}

// Cambiar la contraseña
const changePassword = async (req, res) => {
    
    const token = req.header("x-token");
    const { password, newPassword } = req.body;

    try {
        if (!token) {
            return res.status(400).json({ message: 'Token missing' });
        }

        const decoded = jwt.verify(token, process.env.PASSWORD_KEY || "Magic Secret");

        const user = await User.findOne({ where: { id_persona: decoded.id } });

        if (!user) {
            return res.status(400).json({
                msg: "Usuario no encontrado"
            });
        }

        const passwordValid = await bcrypt.compare(password, user.password);

        if (!passwordValid) {
            return res.status(400).json({
                msg: "Las contraseñas no coinciden, verifica"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.update(
            { password: hashedPassword },
            { where: { id_persona: user.id_persona } }
        );

        const newToken = generateJWT(decoded.id, user.username, decoded.rol);

        return res.status(200).json({
            msg: "Contraseña actualizada",
            newToken
        });

    } catch (error) {
        return res.status(400).json({
            msg: '¡Ha ocurrido un error!'
        });
    }
}

const refreshToken = async (req, res) => {
    const { token } = req.body; // Asumiendo que el cliente envía el token actual
  
    try {
      const decodedToken = jwt.verify(token, process.env.PASSWORD_KEY || "Magic Secret");
  
      const { id, username, rol } = decodedToken;
  
      const newToken = await generateJWT(id, username, rol);
  
      if (!newToken || newToken === "No se pudo generar el token") {
        return res.status(400).json({
          msg: "No se pudo generar un nuevo token"
        });
      }
  
      return res.json({token: newToken});
    } catch (error) {
      console.error("Error:", error);
      res.status(400).json({
        msg: "¡Ha ocurrido un error!",
      });
    }
}

module.exports = {
    LoginPersona,
    getPeopleWithCourses,
    changePassword,
    changeRole,
    isRegisteredCourse,
    usersRegisteredCourses,
    registeredCourse,
    refreshToken
};