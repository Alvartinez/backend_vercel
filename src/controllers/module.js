const Course = require('../models/curso');
const CourseModule = require('../models/curso_modulo');
const Modulo = require('../models/modulo');
const moduloRecurso = require('../models/modulo_recurso');
const Quiz = require('../models/quiz_formativo');
const { Op } = require('sequelize');
const recursoPodcast = require('../models/recurso_podcast');
const recursoSabias = require('../models/recurso_sabias');
const recursoTexto = require('../models/recurso_texto');
const recursoVideo = require('../models/recurso_video');
const lineaTiempo = require('../models/linea_tiempo');
const Podcast = require('../models/podcast');
const sabiasQue = require('../models/sabias_que');
const textoPlano = require('../models/texto_plano');
const Video = require('../models/video');
const Recurso = require('../models/recurso');
const recursoLinea = require('../models/recurso_linea');

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

        const relacionRecursos = await moduloRecurso.findAll({
            where: { id_modulo: cursoModuloInfo.modulo.id_modulo },
            include: [
                {
                    model: Recurso,
                    attributes: ['id_recurso', 'nombre']
                }
            ]
        });

        if (!relacionRecursos || relacionRecursos.length === 0) {
            // No hay recursos asociados
            const response = {
                cursoModuloInfo: {
                    curso: cursoModuloInfo.curso,
                    modulo: cursoModuloInfo.modulo
                },
                quizFormativo: quizFormativo,
                Recursos: []
            };
            return res.status(200).json(response);
        }

        const recursosDetalles = [];

        // Iterar sobre cada recurso relacionado
        for (const recurso of relacionRecursos) {
            let recursoDetalle = null;

            switch (recurso.Recurso.nombre) {
                case "Linea del tiempo":
                    recursoDetalle = await obtenerLineaDelTiempo(recurso);
                    break;

                case "Texto plano":
                    recursoDetalle = await obtenerTextoPlano(recurso);
                    break;

                case "Podcast":
                    recursoDetalle = await obtenerPodcast(recurso);
                    break;

                case "Video":
                    recursoDetalle = await obtenerVideo(recurso);
                    break;

                case "Sabias que":
                    recursoDetalle = await obtenerSabiasQue(recurso);
                    break;

                default:
                    console.error(`Tipo de recurso no manejado: ${recurso.Recurso.nombre}`);
                    break;
            }

            if (recursoDetalle) {
                recursosDetalles.push(recursoDetalle);
            }
        }

        const response = {
            cursoModuloInfo: {
                curso: cursoModuloInfo.curso,
                modulo: cursoModuloInfo.modulo
            },
            quizFormativo: quizFormativo,
            Recursos: recursosDetalles
        };

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha producido un error' });
    }
};

// Funciones auxiliares para obtener detalles de recursos
async function obtenerLineaDelTiempo(recurso) {
    const linea = await recursoLinea.findOne({
        where: { id_recurso: recurso.id_recurso }
    });

    if (linea) {
        return await lineaTiempo.findOne({
            where: { id_linea_tiempo: linea.id_detalle }
        });
    }
    return null;
}

async function obtenerTextoPlano(recurso) {
    const texto = await recursoTexto.findOne({
        where: { id_recurso: recurso.id_recurso }
    });

    if (texto) {
        return await textoPlano.findOne({
            where: { id_texto_plano: texto.id_texto_plano }
        });
    }
    return null;
}

async function obtenerPodcast(recurso) {
    const podcast = await recursoPodcast.findOne({
        where: { id_recurso: recurso.id_recurso }
    });

    if (podcast) {
        return await Podcast.findOne({
            where: { id_podcast: podcast.id_podcast }
        });
    }
    return null;
}

async function obtenerVideo(recurso) {
    const video = await recursoVideo.findOne({
        where: { id_recurso: recurso.id_recurso }
    });

    if (video) {
        return await Video.findOne({
            where: { id_video: video.id_video }
        });
    }
    return null;
}

async function obtenerSabiasQue(recurso) {
    const sabias = await recursoSabias.findOne({
        where: { id_recurso: recurso.id_recurso }
    });

    if (sabias) {
        return await sabiasQue.findOne({
            where: { id_sabias_que: sabias.id_sabias_que }
        });
    }
    return null;
}

// Obtener un módulo a través de su nombre
const getName = async (req, res) => {
    const { nombre } = req.body;

    try {
        const modulo = await Modulo.findOne({
            where: {
                nombre: {
                    [Op.like]: `%${nombre}%`
                }
            }
        });

        if (!modulo) {
            return res.status(400).json({
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

        const moduloExiste = await Modulo.findOne({ where: { id_modulo: id_modulo } });

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

// Eliminar módulo
const deleteModule = async (req, res) => {
    const id = req.params.id;

    try {
        const moduloExiste = await Modulo.findOne({ where: { id_modulo: id } });

        if (!moduloExiste) {
            return res.status(400).json({
                msg: "No existe el módulo"
            });
        }

        const courseModule = await CourseModule.findOne({ where: { id_modulo: id } });

        if (!courseModule) {
            return res.status(400).json({
                msg: "Error al eliminar el módulo"
            });
        }

        const idCurso = courseModule.id_curso; 

        const relacionEliminada = await CourseModule.destroy({ where: { id_modulo: moduloExiste.id_modulo } });

        if (relacionEliminada > 0) {
            const moduloEliminado = await Modulo.destroy({ where: { id_modulo: moduloExiste.id_modulo } });

            if (moduloEliminado > 0) {
                return res.status(200).json({
                    msg: "Módulo eliminado exitosamente"
                });
            } else {
                // Se produjo un error al eliminar el módulo, recrea la relación intermedia
                await CourseModule.create({
                    id_curso: idCurso,
                    id_modulo: id
                });

                return res.status(400).json({
                    msg: "Error al eliminar el módulo"
                });
            }
        }

        res.status(400).json({
            msg: "Error al eliminar la relación intermedia"
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }
}

module.exports = {
    getModule,
    getModules,
    getName,
    newModule,
    updateModule,
    deleteModule
};