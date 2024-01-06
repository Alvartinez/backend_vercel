const Podcast = require("../models/podcast");
const Recurso = require("../models/recurso");
const recursoPodcast = require("../models/recurso_podcast");


exports.newPodcast = async (req, res) => {
    
    const {podcastNuevo} = req.body;

    try {

        const {id_recurso, nombre, podcast} = podcastNuevo;

        const recurso = await Recurso.findOne({ where: {id_recurso: id_recurso} });

        if(!recurso){
            return res.status(400).json({
                msg: "El recurso no existe"
            });
        }

        const podcastRecurso = await Podcast.create({
            nombre: nombre,
            podcast: podcast
        });

        await recursoPodcast.create({
            id_recurso: id_recurso,
            id_podcast: podcastRecurso.id_podcast
        });
         
    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

exports.editPodcast = async (req, res) => {
    
    const {podcastRecurso} = req.body;

    try {

        const {
            id_podcast,
            nombre, 
            podcast
        } = podcastRecurso

        const podcastExiste = await Podcast.findOne({ where: {id_podcast: id_podcast} });

        if(!podcastExiste){
            return res.status(400).json({
                msg: "El podcast no existe"
            });
        }


        if(podcastExiste.nombre !== nombre || podcastExiste.podcast !== podcast ){
            
            await Podcast.update({
                nombre: nombre,
                podcast: podcast
            }, { where: {id_podcast: id_podcast} });

            return res.status(200).json({ msg: "Podcast actualizado exitosamente" });

        }

        return res.status(400).json({ msg: "No hay cambios para realizar" });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

exports.getPodcast = async (req, res) =>{

    const { id_podcast } = req.body;

    try{
        
        const podcast = await Podcast.findOne({where:{id_podcast: id_podcast}});

        if(!podcast){
            return res.status(400).json({
                msg: "No se ha encontrado el texto plano"
            });
        }

        res.status(200).json({
            podcast
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }



}

exports.deletePodcast = async (req, res) => {

    const { podcast } = req.body;

    try {

        const { id_recurso, id_podcast } = podcast;

        const recurso = await Recurso.findOne({ where:{id_recurso: id_recurso} });
        const podcastRecurso = await Podcast.findOne({ where:{ id_podcast: id_podcast} });

        if(!recurso || !podcastRecurso){
            return res.status(400).json({
                msg: "El podcast no existe"
            });
        }

        await recursoPodcast.destroy({
            id_recurso: id_recurso,
            id_podcast: id_podcast
        });

        await Podcast.destroy({
            id_podcast: id_podcast
        });

        res.status(200).json({
            msg: "Podcast eliminado exitosamente"
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}