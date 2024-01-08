const Course = require("../models/curso");
const Person = require("../models/persona");
const CourseModule = require("../models/curso_modulo");
const Modulo = require("../models/modulo");

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
    const { curso } = req.body;

    try {
        const {
            nombre,
            descripcion,
            id_persona,
            objetivos,
            video_presentacion,
            portada,
            publicado
        } = curso;

        const cursoExistente = await Course.findOne({ where: { nombre: nombre } });

        if (cursoExistente) {
            return res.status(400).json({
                msg: "El nombre del curso existe"
            });
        }

        await Course.create({
            nombre,
            descripcion,
            id_persona,
            objetivos,
            video_presentacion,
            portada,
            publicado
        });
        

        return res.status(200).json({ msg: "Curso creado exitosamente" });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha producido un error' });
    }
};

exports.updateCourse = async (req, res) => {
    const { curso } = req.body;

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
        } = curso;

        const cursoExistente = await Course.findOne({ where: { id_curso: id_curso } });

        if (cursoExistente) {
            
            if ((cursoExistente.nombre !== nombre) || (cursoExistente.descripcion !== descripcion) ||
                (cursoExistente.id_persona !== id_persona) || (cursoExistente.objetivos !== objetivos) ||
                (cursoExistente.video_presentacion !== video_presentacion) ||
                (cursoExistente.portada !== portada) || cursoExistente.publicado !== publicado) {

                await Course.update({
                    nombre,
                    descripcion,
                    id_persona,
                    objetivos,
                    video_presentacion,
                    portada,
                    publicado
                }, { where: { id_curso: cursoExistente.id_curso } });

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

        if(!cursoExistente){
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