const moduloRecurso = require("../models/modulo_recurso");
const Podcast = require("../models/podcast");
const Recurso = require("../models/recurso");
const recursoPodcast = require("../models/recurso_podcast");


exports.newPodcast = async (req, res) => {

    try {
        const { id_modulo, recurso, nombre, podcast } = req.body;

        const recursoNuevo = await Recurso.create({
            nombre: recurso
        });

        await moduloRecurso.create({
            id_modulo,
            id_recurso: recursoNuevo.id_recurso
        });

        let podcastRecurso;

        if (podcast !== null) {
            if (nombre !== undefined && nombre !== null) {
                podcastRecurso = await Podcast.create({
                    nombre: nombre,
                    link_podcast: podcast
                });
            } else {
                podcastRecurso = await Podcast.create({
                    link_podcast: podcast
                });
            }

            if(podcastRecurso){
                await recursoPodcast.create({
                    id_recurso: recursoNuevo.id_recurso,
                    id_podcast: podcastRecurso.id_podcast
                });
    
                res.status(200).json({
                    msg: "Podcast creado exitosamente"
                });
            } else {

                await Recurso.destroy({
                    where: {
                        id_recurso: recursoNuevo.id_recurso
                    }
                });
    
                res.status(400).json({
                    msg: "No se pudo crear el podcast correctamente"
                });
            }

        } else {
            res.status(400).json({
                msg: "El campo 'podcast' no puede ser nulo"
            });
        }

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }
}

exports.editPodcast = async (req, res) => {

    try {

        const {
            id_podcast,
            nombre, 
            podcast
        } = req.body;

        const podcastExiste = await Podcast.findOne({ where: {id_podcast: id_podcast} });

        if(!podcastExiste){
            return res.status(400).json({
                msg: "El podcast no existe"
            });
        }


        if(podcastExiste.nombre !== nombre || podcastExiste.podcast !== podcast ){
            
            if (podcastExiste.nombre !== nombre) {

                if (podcastExiste.link_podcast !== podcast) {

                    await Podcast.update({
                        nombre: nombre,
                        link_podcast: podcast
                    }, { where: {id_podcast: id_podcast} });

                }else{

                    await Podcast.update({
                        nombre: nombre
                    }, { where: {id_podcast: id_podcast} });

                }

            }else{

                if (podcastExiste.link_podcast === podcast) {

                    return res.status(200).json({
                        msg: "No hay cambios por realizar"
                    });

                }

                await Podcast.update({
                    link_podcast: podcast
                }, { where: {id_podcast: id_podcast} });

            }

            return res.status(200).json({ msg: "Podcast actualizado exitosamente" });

        }

        return res.status(400).json({ msg: "No hay cambios para realizar" });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

exports.getPodcast = async (req, res) =>{

    const id = req.params.id;

    try{
        
        const podcast = await Podcast.findOne({where:{id_podcast: id}});

        if(!podcast){
            return res.status(400).json({
                msg: "No se ha encontrado el Podcast"
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

exports.getPodcasts = async (req, res) => {

    const id = req.params.id;

    try{

        const moduloRecursos = await moduloRecurso.findAll({
            where: {
                id_modulo: id
            }
        });

        const idRecursos = moduloRecursos.map(moduloRecurso => moduloRecurso.id_recurso);

        const podcastRecursos = await recursoPodcast.findAll({
            where: {
                id_recurso: idRecursos
            }
        });

        const idPodcast = podcastRecursos.map(podRecurso => podRecurso.id_podcast);

        const pod = await Podcast.findAll({
            where: {
                id_podcast: idPodcast
            }
        });

        if(!pod){
            return res.status(400).json({
                msg: "No se ha encontrado podcasts"
            });
        }

        res.status(200).json({
            Podcast: pod
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

exports.deletePodcast = async (req, res) => {

    try {

        const id = req.params.id;

        const podcastRecurso = await Podcast.findOne({ where:{ id_podcast: id} });
        const recurso_podcast = await recursoPodcast.findOne({ where:{ id_podcast: podcastRecurso.id_podcast} });
        const recurso = await Recurso.findOne({ where:{id_recurso: recurso_podcast.id_recurso} });

        if(!recurso || !podcastRecurso){
            return res.status(400).json({
                msg: "El podcast no existe"
            });
        }

        await recursoPodcast.destroy({
            where:{
                id_recurso: recurso.id_recurso,
                id_podcast: id
            }
        });

        await Podcast.destroy({
            where:{
                id_podcast: id
            }
        });

        await moduloRecurso.destroy({
            where: {
                id_recurso: recurso.id_recurso
            }
        });

        await Recurso.destroy({
            where: {
                id_recurso: recurso.id_recurso
            }
        });

        res.status(200).json({
            msg: "Podcast eliminado exitosamente"
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}