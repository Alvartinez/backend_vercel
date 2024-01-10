const lineaTiempo = require("../models/linea_tiempo");
const Modulo = require("../models/modulo");
const moduloRecurso = require("../models/modulo_recurso");
const Recurso = require("../models/recurso");
const textoPlano = require("../models/texto_plano");

exports.newResource = async (req, res) => {
    const {recurso} = req.body;

    try {
        
        const { id_modulo, nombre} = recurso;

        const moduloExiste = await Modulo.findOne({ where: { id_modulo: id_modulo }});
    
        if(!moduloExiste){
            return res.status(400).json({
                msg: "El módulo no existe"
            });
        }
    
        const nuevoRecurso = await Recurso.create({
            nombre
        });

        const idRecursoCreado = nuevoRecurso.id_recurso;

        await moduloRecurso.create({
            id_modulo: id_modulo,
            id_recurso: idRecursoCreado
        });
    
        res.status(200).json({
            msg: "Recurso generado exitosamente"
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

exports.getResource = async (req, res) =>{

    const id = req.params.id;

    try{
        
        const recurso = await Recurso.findOne({where:{id_recurso: id}});

        if(!recurso){
            return res.status(400).json({
                msg: "No se ha encontrado el recurso"
            });
        }

        res.status(200).json({
            recurso
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }



}

exports.getAllResources = async (req, res) => {
    const {id} = req.body;

    try {
        const moduloExiste = await Modulo.findOne(
            {
                where: { id_modulo: id }  
            }
        );

        if(!moduloExiste){
            return res.status(400).json({
                msg: "No se ha encontrado el módulo"
            });
        }

        const recursosExisten = await moduloRecurso.findAll({
             where: {
                id_modulo: moduloExiste.id_modulo
             }
            });

        res.json(recursosExisten);

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }
}

exports.deleteResource = async (req, res) => {

    const {recurso} = req.body;

    try {
        
        const {id_modulo, id_recurso} = recurso;

        const modulo = await Modulo.findOne({ where: { id_modulo: id_modulo } });
        const recurso = await Recurso.findOne({ where: { id_recurso:id_recurso } });

        if(!modulo || !recurso){
            return res.status(400).json({
                msg: "El recurso no existe"
            });
        }

        await moduloRecurso.destroy({
            id_modulo: id_modulo,
            id_recurso: id_recurso
        });

        await Recurso.destroy({
            id_recurso: id_recurso
        });

        res.status(200).json({
            msg: "Recurso eliminado exitosamente"
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}