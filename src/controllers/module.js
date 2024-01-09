const Course = require('../models/curso');
const CourseModule = require('../models/curso_modulo');
const Modulo = require('../models/modulo');
const Quiz = require('../models/quiz_formativo');

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

    const { id_curso } = req.body;

    try{

        const cursoExiste = await Course.findOne({where:{id_curso:id_curso}});

        if(!cursoExiste){
            return res.status(400).json({
                msg: "No existe el curso"
            });
        }

        

        const availableModules = await Modulo.findAll({
            include: {
                model: Course,
                as: "curso",
                attributes: ["nombre", "descripcion"]
            }
        });
    
        const modulosInfo = availableModules.map( (modulos) => {
            return {
                nombre: modulos.nombre,
                descripcion: modulos.descripcion,
                objetivo: modulos.objetivo,
                conclusion: modulos.conclusion,
                portada: modulos.portada,
                competencias: modulos.competencias,
                duracion: modulos.duracion,
                temas: modulos.temas
            };
        });
    
        res.json(modulosInfo);

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

// Obtener un módulo en específico
const getModule = async (req, res) => {
    const id = req.params.id;

    try {
        const infoModulo = await Modulo.findOne({
            where: { id_modulo: id },
            include: [
                {
                    model: Quiz,
                    as: 'quiz_formativo',
                    attributes: ['id_quiz_formativo', 'titulo']
                }
            ]
        });

        if (!infoModulo) {
            return res.status(400).json({
                msg: 'No se encuentra información, comuníquese con el Admin'
            });
        }

        const curso = await CourseModule.findOne({ 
            where: { id_modulo}
         });

        res.json(infoModulo, curso.id_curso);
    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
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
            competencias,
            duracion,
            temas
        } = modulo;

        const moduloExiste = await Modulo.findOne({ where: { id_modulo:id_modulo } });

        if( moduloExiste.nombre != nombre || moduloExiste != descripcion || moduloExiste.objetivo != objetivo
            || moduloExiste.conclusion != conclusion || moduloExiste.portada != portada
            || moduloExiste.competencias != competencias || moduloExiste.duracion != duracion
            || moduloExiste.temas != temas 
            ){

            const editModule = await Modulo.update({
                nombre: nombre,
                descripcion: descripcion,
                objetivo: objetivo,
                conclusion: conclusion,
                portada: portada,
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
    newModule,
    updateModule
};