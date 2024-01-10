const Course = require('../models/curso');
const CourseModule = require('../models/curso_modulo');
const Modulo = require('../models/modulo');
const Quiz = require('../models/quiz_formativo');
const { Op } = require('sequelize');

//Nuevo módulo
const newModule = async (req, res) =>{
    const {modulo} = req.body;

    try{

        const {
            id_curso,
            nombre,
            descripcion,
            objetivo,
            conclusion,
            portada,
            creadores,
            competencias,
            duracion,
            temas
        } = modulo;

        const cursoExiste = await Course.findOne({ where: {id_curso:id_curso} });
        
        if(!cursoExiste){
            return res.status(400).json({
                msg: 'No existe el curso'
            });
        }

        const moduloExistente = await Modulo.findOne({
            where: {
                nombre: nombre
            }
        });

        if (moduloExistente) {
            return res.status(400).json({
                msg: 'Ya existe un módulo con el mismo nombre en este curso'
            });
        }
        
        const moduloNuevo = await Modulo.create({
            nombre: nombre,
            descripcion: descripcion,
            objetivo: objetivo,
            conclusion: conclusion,
            portada: portada,
            creadores: creadores,
            competencias: competencias,
            duracion: duracion,
            temas: temas
        });

        await CourseModule.create({
            id_curso,
            id_modulo: moduloNuevo.id_modulo
        }); 

        res.status(200).json({
            msg: "Módulo creado exitosamente"
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

// Traer todos los módulos 
const getModules = async (req, res) => {
    const { id_curso } = req.params; 

    try {
        // Verificar si el curso existe
        const cursoExiste = await Course.findOne({ where: { id_curso } });

        if (!cursoExiste) {
            return res.status(400).json({
                msg: "No existe el curso"
            });
        }

        // Obtener todos los módulos del curso específico
        const modulosEspecificos = await CourseModule.findAll({
            where: { id_curso },
            include: [
                {
                    model: Modulo,
                    as: "modulo",
                    attributes: ["id_modulo", "nombre", "descripcion", "objetivo", "conclusion", "portada", "competencias", "duracion", "temas"]
                }
            ]
        });

        if (!modulosEspecificos || modulosEspecificos.length === 0) {
            return res.status(200).json({
                msg: "No existen módulos actualmente"
            });
        }

        // Mapear la información de los módulos
        const modulosInfo = modulosEspecificos.map(({ modulo }) => ({
            id_modulo: modulo.id_modulo,
            nombre: modulo.nombre,
            descripcion: modulo.descripcion,
            objetivo: modulo.objetivo,
            conclusion: modulo.conclusion,
            portada: modulo.portada,
            competencias: modulo.competencias,
            duracion: modulo.duracion,
            temas: modulo.temas
        }));

        res.json(modulosInfo);

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha producido un error' });
    }
}

// Obtener un módulo en específico
const getModule = async (req, res) => {
    const id = req.params.id;

    try {
        const cursoModuloInfo = await CourseModule.findOne({
            where: { id_modulo: id },
            include: [
                {
                    model: Course,
                    as: 'curso',
                    attributes: ['id_curso', 'nombre']
                },
                {
                    model: Modulo,
                    as: 'modulo'
                }
            ]
        });

        if (!cursoModuloInfo) {
            return res.status(400).json({
                msg: 'No se encuentra información, comuníquese con el Admin'
            });
        }

        // Obtener el QuizFormativo asociado al Modulo
        const quizFormativo = await Quiz.findOne({
            where: { id_modulo: cursoModuloInfo.modulo.id_modulo },
            attributes: ['id_quiz_formativo', 'titulo']
        });

        // Crear la estructura deseada
        const response = {
            cursoModuloInfo: {
                curso: cursoModuloInfo.curso,
                modulo: cursoModuloInfo.modulo
            },
            quizFormativo: quizFormativo
        };

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha producido un error' });
    }
};

//Obtener un módulo a través de su nombre
const getModuleName = async (req, res) => {
    const { nombre } = req.body;

    try {
        const modulo = await module.findOne({ where: { nombre: { [Op.iLike]: nombre } } });

        if (!modulo) {
            res.status(400).json({
                msg: "No existe el módulo"
            });
        }

        res.status(200).json(modulo);

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha producido un error' });
    }
}

//Editar módulo
const updateModule = async (req, res) => {
    const {modulo} = req.body;

    try{

        const {
            id_modulo,
            nombre,
            descripcion,
            objetivo,
            conclusion,
            portada,
            creadores,
            competencias,
            duracion,
            temas
        } = modulo;

        const moduloExiste = await Modulo.findOne({ where: { id_modulo:id_modulo } });

        if( moduloExiste.nombre != nombre || moduloExiste != descripcion || moduloExiste.objetivo != objetivo
            || moduloExiste.conclusion != conclusion || moduloExiste.portada != portada
            || moduloExiste.creadores !== creadores || moduloExiste.competencias != competencias
            || moduloExiste.duracion != duracion || moduloExiste.temas != temas 
            ){

            const editModule = await Modulo.update({
                nombre: nombre,
                descripcion: descripcion,
                objetivo: objetivo,
                conclusion: conclusion,
                portada: portada,
                creadores: creadores,
                competencias: competencias,
                duracion: duracion,
                temas: temas

            },
            {
              where: { id_modulo: moduloExiste.id_modulo }  
            });

            if(editModule > 0){
                return res.status(200).json({
                    msg: "Módulo actualizado"
                });
            }

        }

        return res.status(400).json({
            msg: "No hay cambios para realizar"
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

module.exports = {
    getModule,
    getModules,
    getModuleName,
    newModule,
    updateModule
};