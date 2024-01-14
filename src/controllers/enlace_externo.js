const Activity = require("../models/actividad");
const actividadEnlace = require("../models/actividad_enlace_externo");
const Enlace = require("../models/enlace_externo");
const moduloActividad = require("../models/modulo_actividad");


exports.newEnlace = async (req, res) => {

    const {enlace} = req.body;

    try{

        const {
            id_modulo, 
            actividad, 
            titulo, 
            link
        } = enlace;

        const NuevaActividad = await Activity.create({
            nombre:actividad
        });

        await moduloActividad.create({
            id_modulo,
            id_actividad: NuevaActividad.id_actividad
        });

        let enlaceExterno;

        if(titulo !== null || titulo !== undefined){

            enlaceExterno = await Enlace.create({
                titulo,
                enlace: link
            });

        }else{

            enlaceExterno = await Enlace.create({
                enlace: link
            });

        }

        await actividadEnlace.create({
            id_actividad: NuevaActividad.id_actividad,
            id_enlace_externo: enlaceExterno.id_enlace_externo
        });

        res.status(200).json({
            msg: "Enlace Externo creado exitosamente"
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

exports.editEnlace = async (req, res) => {

    const {enlace} = req.body;

    try{

        const {
            id_enlace_externo, 
            titulo, 
            link
        } = enlace;

        const enlaceExiste = await Enlace.findOne({
            where: {
                id_enlace_externo
            }
        });

        if(!enlaceExiste){
            return res.status(400).json({
                msg: "No se ha encontrado el enlace externo"
            });
        }

        let cambiosRealizados = false;

        if(enlaceExiste.titulo !== titulo) {
            enlaceExiste.titulo = titulo;
            cambiosRealizados = true;
        }

        if(enlaceExiste.enlace !== link) {
            enlaceExiste.enlace = link;
            cambiosRealizados = true;
        }

        if (cambiosRealizados) {
            await enlaceExiste.save();
            res.status(200).json({
                msg: "Enlace externo actualizado exitosamente"
            });
        } else {
            res.status(200).json({
                msg: "No se realizaron cambios en el Enlace externo"
            });
        }

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }
    
}

exports.deleteEnlace = async (req, res) => {

    const { enlace } = req.body;

    try {

        const { id_actividad, id_enlace_externo } = enlace;

        const enlaceExiste = await Enlace.findOne({
            where: {
                id_enlace_externo
            }
        });

        const actividad = await Activity.findOne({
            where: {
                id_actividad
            }
        });

        if(!actividad || !enlaceExiste){
            return res.status(400).json({
                msg: "Enlace externo no existe"
            });
        }

        await actividadEnlace.destroy({
            where:{
                id_actividad,
                id_enlace_externo
            }
        });

        await Enlace.destroy({
            where: {
                id_enlace_externo
            }
        });

        await moduloActividad.destroy({
            where: {
                id_actividad
            }
        });

        await Activity.destroy({
            where: {
                id_actividad
            }
        });

        res.status(200).json({
            msg: "Actividad eliminada exitosamente"
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

exports.getEnlace = async (req, res) => {

    const id = req.params.id;

    try{

        const enlaceExiste = await Enlace.findOne({
            where: {
                id_enlace_externo: id
            }
        });

        if(!enlaceExiste){
            return res.status(400).json({
                msg: "No se ha encontrado el Sabías qué"
            });
        }

        res.status(200).json({
            enlaces_Externos: enlaceExiste
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }
    
}

exports.getEnlaceAll = async (req, res) => {

    const id = req.params.id;

    try{

        const modulo_actividad = await moduloActividad.findAll({
            where: {
                id_modulo: id
            }
        });

        const idActividades = modulo_actividad.map(modulo_actividades => modulo_actividades.id_actividad);

        const enlaceActividades = await actividadEnlace.findAll({
            where: {
                id_actividad: idActividades
            }
        });

        const idsEnlace = enlaceActividades.map(enlaceActivity => enlaceActivity.id_enlace_externo);

        const enlace = await Enlace.findAll({
            where: {
                id_enlace_externo: idsEnlace
            }
        });

        if(!enlace){
            return res.status(400).json({
                msg: "No se ha encontrado los enlaces"
            });
        }

        res.status(200).json({
            Enlace_Externos: enlace
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}