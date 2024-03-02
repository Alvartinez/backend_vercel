const bcrypt = require("bcrypt");
const Person = require("../models/persona");
const User = require("../models/user");
const Rol = require("../models/rol");
const jwt = require("jsonwebtoken");
const generateRandomUsername = require("../helper/randomUsername");
const enviarMensajeInsideServer = require("../helper/sendEmail");

//Trae a un usuario en específico según los tres párametros
const getUserComplete = async (req, res) => {
  const { nombre, role, status } = req.body;

  try {

    const usuarios = await Person.findAll({
      where: {
        nombre: {
          [Op.like]: `%${nombre}%`
        }
      },
      include: [
        { 
          model: User, 
          as: 'user',
          attributes: ['id_rol'],
          include: [
            { 
              model: Rol, 
              as: 'rol', 
              attributes: ['id_rol', 'cargo']
            }
          ]
        }
      ] 
    });

    if (usuarios.length === 0) {
      return res.status(400).json({ msg: 'No se ha encontrado al usuario o usuarios' });
    }

    const usuariosFiltrados = [];

    for (const usuario of usuarios) {
      const userStatus = usuario.estado;
      const userRole = usuario.user[0].rol.cargo;

      if (userStatus === status && userRole === role) {
        usuariosFiltrados.push(usuario);
      }
    }

    if (usuariosFiltrados.length === 0) {
      return res.status(400).json({ msg: 'No se encontraron usuarios con el estado y rol proporcionados' });
    }

    res.json(usuariosFiltrados);

  } catch (error) {
    console.error(error);
    res.status(400).json({
      msg: 'Se ha ocurrido un error'
    });
  }

}

//Traer a un usuario o usuarios según rol y estado
const getUserRoleStatus = async (req, res) => {
  const { role, status } = req.body;

  try {
    // Buscar el rol
    const targetRole = await Rol.findOne({
      where: {
        cargo: role
      }
    });

    if (!targetRole) {
      return res.status(400).json({
        msg: 'Rol no encontrado'
      });
    }

    // Obtener el ID del rol
    const roleId = targetRole.id_rol;

    // Buscar usuarios con el mismo rol y estado
    const usuariosRoles = await User.findAll({
      where: {
        id_rol: roleId
      },
      include: [
        {
          model: Person,
          as: 'persona'
        },
        {
          model: Rol,
          as: 'rol'
        }
      ]
    });

    if (!usuariosRoles) {
      return res.status(400).json({
        msg: 'Se ha producido un error'
      });
    }

    // Filtrar usuarios por estado
    const usuariosFiltrados = usuariosRoles.filter(usuario => usuario.persona.estado === status);

    if (usuariosFiltrados.length === 0) {
      return res.status(400).json({ msg: 'No se encontraron usuarios con el estado proporcionado' });
    }

    res.json(usuariosFiltrados);

  } catch (error) {
    console.error(error);
    res.status(400).json({
      msg: 'Se ha ocurrido un error'
    });
  } 

}

//Traer a un usuario o usuarios según nombre y estado
const getUserNameStatus = async (req, res) => {
  const { nombre, status } = req.body;

  try {

    const usuarios = await Person.findAll({
      where: {
        nombre: {
          [Op.like]: `%${nombre}%`
        }
      },
      include: [
        { 
          model: User, 
          as: 'user',
          attributes: ['id_rol'],
          include: [
            { 
              model: Rol, 
              as: 'rol', 
              attributes: ['id_rol', 'cargo']
            }
          ]
        }
      ] 
    });

    if (usuarios.length === 0) {
      return res.status(400).json({ msg: 'No se ha encontrado al usuario o usuarios' });
    }

    const usuariosFiltrados = [];

    for (const usuario of usuarios) {
      const userStatus = usuario.estado; // Obtiene el estado del usuario
  
      if (status === userStatus) {
        usuariosFiltrados.push(usuario);
      }
    }
  
    if (usuariosFiltrados.length === 0) {
      return res.status(400).json({ msg: 'No se encontraron usuarios con el estado proporcionado' });
    }
  
    res.json(usuariosFiltrados);

  } catch (error) {
    console.error(error);
    res.status(400).json({
      msg: 'Se ha ocurrido un error'
    });
  }

}

//Traer a un usuario o usuarios según nombre y rol
const getUserNameRol = async (req, res) => {
  const { nombre, role } = req.body;

  try {

    const usuarios = await Person.findAll({
      where: {
        nombre: {
          [Op.like]: `%${nombre}%`
        }
      },
      include: [
        { 
          model: User, 
          as: 'user',
          attributes: ['id_rol'],
          include: [
            { 
              model: Rol, 
              as: 'rol', 
              attributes: ['id_rol', 'cargo']
            }
          ]
        }
      ] 
    });

    if (usuarios.length === 0) {
      return res.status(400).json({ msg: 'No se ha encontrado al usuario o usuarios' });
    }

    const usuariosFiltrados = [];

    for (const usuario of usuarios) {
      const cargo = usuario.user[0].rol.cargo; // Obtiene el cargo del usuario
  
      if (role === cargo) {
        usuariosFiltrados.push(usuario);
      }
    }
  
    if (usuariosFiltrados.length === 0) {
      return res.status(400).json({ msg: 'No se encontraron usuarios con el rol proporcionado' });
    }
  
    res.json(usuariosFiltrados);

  } catch (error) {
    console.error(error);
    res.status(400).json({
      msg: 'Se ha ocurrido un error'
    });
  }
}

//Traer a los usuarios según su estado
const getPeopleStatus = async (req, res) => {

  const status = req.params.status;

  try {
    const personasEstado = await Person.findAll({
      where: {
        estado: status
      },
      include: [
        { 
          model: User, 
          as: 'user',
          attributes: ['id_rol'],
          include: [
            { 
              model: Rol, 
              as: 'rol', 
              attributes: ['id_rol', 'cargo']
            }
          ]
        }
      ]
    });

    res.json(personasEstado);

  } catch (error) {
    console.error(error);
    res.status(400).json({
      msg: 'Se ha ocurrido un error'
    });
  } 
}

//Traer a los usuarios según su rol
const getPeopleRole = async (req, res) => {

  const role  = req.params.role;

  try {
    const Role = await Rol.findOne({
      where: {
        cargo: role
      }
    });

    if(!Role){
      res.status(400).json({
        msg: 'Se ha ocurrido un error'
      });
    }

    const idRol = Role.id_rol;

    const usuariosRoles = await User.findAll({
      where: {
        id_rol: idRol
      },
      include: [
        {
          model: Person,
          as: 'persona'
        },
        {
          model: Rol,
          as: 'rol'
        }
      ]
    });

    if(!usuariosRoles){
      res.status(400).json({
        msg: 'Se ha ocurrido un error'
      });
    }

    // Mapeamos el resultado para obtener solo la info de persona y rol
    const resultado = usuariosRoles.map((usuario) => ({
      persona: usuario.persona,
      rol: usuario.rol
    }));

    res.json(resultado);

  } catch (error) {
    console.error(error);
    res.status(400).json({
      msg: 'Se ha ocurrido un error'
    });
  } 
}

// Trae una lista de usuarios
const getPeople = async (req, res) => {
  try {
    const listPerson = await Person.findAll({
      include: [
        {
          model: User,
          as: "user",
          include: [{ model: Rol, as: "rol" }],
        },
      ],
    });

    if (!listPerson) {
      res.status(400).json({
        msg: "Se ha ocurrido, consulta al Admin",
      });
    }

    res.json({ listPerson });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      msg: "Se ha ocurrido un error",
    });
  }
};

//Traer a un usuario específico según su nombre
const getUserName = async (req, res) => {

  const nombre = req.params.name;

  try {

    const usuarios = await Person.findAll({
      where: {
        nombre: {
          [Op.like]: `%${nombre}%`
        }
      },
      include: [
        { 
          model: User, 
          as: 'user',
          attributes: ['id_rol'],
          include: [
            { 
              model: Rol, 
              as: 'rol', 
              attributes: ['id_rol', 'cargo']
            }
          ]
        }
      ] 
    });

    if (usuarios.length === 0) {
      return res.status(400).json({ msg: 'No se ha encontrado al usuario o usuarios' });
    }

    res.json(usuarios);

  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: 'Se ha ocurrido un error' });
  }

}

// Trae a un usuario en específico
const getPerson = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const secretKey = process.env.PASSWORD_KEY || "Magic Secret";

  try {
    const decodedToken = jwt.verify(token, secretKey) || {};
    const userId = decodedToken.id;

    const user = await Person.findOne({ where: { id_persona: userId } });

    if (user) {
      const userInfo = {
        nombre: user.nombre,
        username: user.username,
        email: user.email,
        fecha_registro: user.fecha_registro,
        portada: user.portada,
        rol: decodedToken.rol,
      };

      res.json(userInfo);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: "Se ha ocurrido un error" });
  }
};

// Crear un nuevo usuario
const newPersona = async (req, res) => {
  const { nombre, email, password, estado, rol } = req.body;

  // Validar si existe el usuario
  const user = await Person.findOne({ where: { email: email } });

  estado = estado === undefined ? false : estado;

  if (user) {
    return res.status(400).json({
      msg: "Ya existe el usuario " + nombre + ".",
    });
  }

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const dateStr = `${year}-${month}-${day}`;

  const hashedPassword = await bcrypt.hash(password, 10);

  let username = generateRandomUsername(nombre);

  let isUsernameTaken = await User.findOne({ where: { username: username } });

  while (isUsernameTaken) {
    username = generateRandomUsername(nombre);
    isUsernameTaken = await User.findOne({ where: { username: username } });
  }

  try {
    // Creación del usuario
    await Person.create({
      nombre: nombre,
      email: email,
      estado: estado,
      fecha_registro: dateStr,
    });

    const id = await Person.findOne({ where: { email: email } });

    let id_rol = 1; // Valor por defecto para "Visitante"
    switch(rol) {
      case "Docente":
        id_rol = 3;
        break;
      case "Admin":
        id_rol = 4;
        break;
    }

    await User.create({
      id_persona: id.id_persona, 
      id_rol, username, password: hashedPassword 
    });

    // Información para usar en el email
    const infoEmail = {
      nombre,
      username,
      email,
      password,
    };

    await enviarMensajeInsideServer(infoEmail, "Usuario registrado");

    res.json({
      msg: "Usuario " + nombre + " creado exitosamente"
    });
  } catch (error) {
    res.status(400).json({
      msg: "¡Ha ocurrido un error!",
    });
  }
};

// Deshabilita a un usuario
const disabledPersona = async (req, res) => {
  const { nombre } = req.body;

  // Encuentra al usuario
  const user = await Person.findOne({ where: { nombre: nombre } });

  try {
    // Si se encuentra registrado
    if (!user) {
      return res.status(400).json({
        msg: "No existe usuario " + nombre,
      });
    }

    if (!user.estado) {
      return res.status(401).json({
        msg: "Ya se encuentra deshabilitado",
      });
    }

    const status_User = await Person.update(
      { estado: false },
      { where: { id_persona: user.id_persona } }
    );

    if (!status_User) {
      return res.status(401).json({
        msg: "Se ha ocurrido un error con el proceso",
      });
    }

    res.status(200).json({
      msg: "Se ha deshabilitado el usuario " + nombre,
    });
  } catch (error) {
    res.status(400).json({
      msg: "¡Ha ocurrido un error!",
    });
  }
};

// Elimina a un usuario
const deletePersona = async (req, res) => {
  const { nombre } = req.body;

  try {
    // Encuentra al usuario
    const user = await Person.findOne({ where: { nombre: nombre } });

    // Si no se encuentra registrado
    if (!user) {
      return res.status(400).json({
        msg: "No existe usuario " + nombre,
      });
    }

    // Eliminar al usuario
    const deletedRows = await Person.destroy({
      where: { id_persona: user.id_persona },
    });

    if (deletedRows === 1) {
      return res.status(200).json({
        msg: "Se ha eliminado el usuario " + nombre,
      });
    } else {
      return res.status(401).json({
        msg: "No se pudo eliminar el usuario",
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: "¡Ha ocurrido un error!",
    });
  }
};

// Habilita a un usuario
const enabledPersona = async (req, res) => {
  const { nombre } = req.body;

  // Encuentra al usuario
  const user = await Person.findOne({ where: { nombre: nombre } });

  try {
    // Si se encuentra registrado
    if (!user) {
      return res.status(400).json({
        msg: "No existe usuario " + nombre,
      });
    }

    if (user.estado) {
      return res.status(401).json({
        msg: "Ya se encuentra habilitado",
      });
    }

    const status_User = await Person.update(
      { estado: true },
      { where: { id_persona: user.id_persona } }
    );

    if (!status_User) {
      return res.status(401).json({
        msg: "Se ha ocurrido un error con el proceso",
      });
    }

    res.status(200).json({
      msg: "Se ha habilitado el usuario " + nombre,
    });
  } catch (error) {
    res.status(400).json({
      msg: "¡Ha ocurrido un error!",
    });
  }
};

module.exports = {
  getPeople,
  getPerson,
  newPersona,
  disabledPersona,
  deletePersona,
  enabledPersona,
  getUserComplete,
  getUserRoleStatus,
  getUserNameStatus,
  getUserNameRol,
  getPeopleStatus,
  getPeopleRole,
  getUserName
};