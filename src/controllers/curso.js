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