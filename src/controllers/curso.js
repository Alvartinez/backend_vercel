const { Op } = require("sequelize");
const Course = require("../models/curso");
const Person = require("../models/persona");
const CourseModule = require("../models/curso_modulo");
const Modulo = require("../models/modulo");
const Inscrito = require("../models/inscrito");

exports.getAllCourses = async (req, res) => {
    try {
        const availableCourses = await Course.findAll({
            include: {
                model: Person,
                as: "persona",
                attributes: ["nombre", "email"],
            },
        });

        const cursosInfo = availableCourses.map((curso) => {
            return {
                id_curso: curso.id_curso,
                nombre: curso.nombre,
                descripcion: curso.descripcion,
                objetivos: curso.objetivos,
                creador: {
                    nombre: curso.persona.nombre,
                    email: curso.persona.email,
                },
                portada: curso.portada
            };
        });

        res.json(cursosInfo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Se ha producido un error" });
    }
};

exports.getCurso = async (req, res) => {
    const id = req.params.id;

    try {
        const selectedCourse = await Course.findOne({
            where: { id_curso: id },
            include: {
                model: Person,
                as: "persona",
                attributes: ["nombre", "email"]
            }
        });

        if (selectedCourse) {
            const courseInfo = {
                //Temporal
                id: selectedCourse.id_curso,
                //Temporal
                nombre: selectedCourse.nombre,
                descripcion: selectedCourse.descripcion,
                objetivos: selectedCourse.objetivos,
                presentacion: selectedCourse.video_presentacion,
                creador: {
                    nombre: selectedCourse.persona.nombre,
                    email: selectedCourse.persona.email
                },
                portada: selectedCourse.portada,
                modulos: {}
            };

            const modules = await CourseModule.findAll({
                where: { id_curso: id },
                attributes: ['id_modulo'],
                include: {
                    model: Modulo,
                    as: "modulo",
                    attributes: ["nombre"]
                }
            });

            // Formateamos los módulos para que solo contengan id_modulo y nombre
            courseInfo.modulos = modules.map((module) => ({
                id_modulo: module.id_modulo,
                nombre: module.modulo.nombre
            }));

            res.json(courseInfo);

        } else {
            return res.status(400).json({
                msg: "No existe ese curso"
            });
        }

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }
};

exports.newCourse = async (req, res) => {
    try {
        const { 
            nombre, 
            descripcion, 
            id_persona, 
            objetivos, 
            video_presentacion, 
            publicado 
        } = req.body;

        // Convertir el archivo de imagen a base64
        const portada = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : '';

        const cursoNuevo = await Course.create({
            nombre,
            descripcion,
            id_persona,
            objetivos,
            video_presentacion,
            portada,
            publicado
        });

        res.status(200).json({ message: "Curso creado exitosamente", data: cursoNuevo });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Se ha producido un error' });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const {
            id_curso,
            nombre,
            descripcion,
            id_persona,
            objetivos,
            video_presentacion,
            portada,
            publicado
        } = req.body;

        const cursoExistente = await Course.findOne({ where: { id_curso: id_curso } });

        if (cursoExistente) {
            
            let camposParaActualizar = {};

            // Compara y agrega al objeto de actualización solo los campos que han cambiado.
            if (nombre && cursoExistente.nombre !== nombre) camposParaActualizar.nombre = nombre;
            if (descripcion && cursoExistente.descripcion !== descripcion) camposParaActualizar.descripcion = descripcion;
            if (id_persona && cursoExistente.id_persona !== id_persona) camposParaActualizar.id_persona = id_persona;
            if (objetivos && JSON.stringify(cursoExistente.objetivos) !== JSON.stringify(objetivos)) camposParaActualizar.objetivos = objetivos; // Asumiendo que objetivos es un objeto o array
            if (video_presentacion && cursoExistente.video_presentacion !== video_presentacion) camposParaActualizar.video_presentacion = video_presentacion;
            if (publicado !== undefined && cursoExistente.publicado !== publicado) camposParaActualizar.publicado = publicado;
            
            if (req.file) {
                const nuevaPortada = req.file.buffer.toString('base64');
                camposParaActualizar.portada = nuevaPortada;
            }
            // De lo contrario, si se envía portada en el cuerpo de la solicitud, y es diferente a la existente, usar esa.
            else if (portada && cursoExistente.portada !== portada) {
                camposParaActualizar.portada = portada;
            }
    
            // Verifica si hay campos para actualizar
            if (Object.keys(camposParaActualizar).length > 0) {
                await Course.update(camposParaActualizar, { where: { id_curso: id_curso } });
                return res.status(200).json({ msg: "Curso actualizado exitosamente" });
            } else {
                return res.status(400).json({ msg: "No hay cambios para realizar" });
            }
        } else {
            return res.status(400).json({
                msg: "No existe el curso"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }
}

exports.deleteCourse = async (req, res) => {

    const id = req.params.id;

    try{

        const cursoExistente = await Course.findOne({ where: { id_curso: id } });

        if(!cursoExistente){
            return res.status(400).json({
                msg: "EL curso no existe"
            });
        }

        const deletedCourse = await Course.destroy({ where: {id_curso: id} });

        if(deletedCourse > 0){
            return res.status(200).json({
                msg: "Curso eliminado exitosamente"
            });
        }

        res.status(400).json({
            msg: "Curso no ha sido eliminado exitosamente"
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

exports.publishedCourse = async (req, res) => {

    const {id_curso} = req.body;
    
    try{

        const course = await Course.findOne({ where: { id_curso: id_curso } });

        if(!course){
            return res.status(400).json({
                msg: "EL curso no existe"
            });
        }

        await Course.update({
            publicado: !course.publicado
        },
         { where: { id_curso: id_curso }
        });

        res.status(200).json({
            msg: "Estado de publicación actualizado exitosamente",
            nuevoEstado: !course.publicado,
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

exports.getEnrolledCourses = async (req, res) => {

    const apprenticeId = req.params.id;

    try{

        const enrolledCourses = await Inscrito.findAll({
            where: { id_inscrito: apprenticeId },
            include: {
                model: Course,
                as: 'curso'
            }            
        });

        const cursosInfo = enrolledCourses.map(inscripcion => {
            const curso = inscripcion.curso;
            return {
                id_curso: curso.id_curso,
                nombre: curso.nombre,
                descripcion: curso.descripcion,
                portada: curso.portada
            };
        });

        res.json(cursosInfo);

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}