const moduloRecurso = require("../models/modulo_recurso");
const Recurso = require("../models/recurso");
const recursoVideo = require("../models/recurso_video");
const Video = require("../models/video");


exports.newVideo = async (req, res) => {
    
    const {videoNuevo} = req.body;

    try {

        const {id_modulo, recurso, nombre, video} = videoNuevo;

        const recursoNuevo = await Recurso.create({
            nombre:recurso
        });

        await moduloRecurso.create({
            id_modulo,
            id_recurso: recursoNuevo.id_recurso
        });

        const videoRecurso = await Video.create({
            nombre,
            video: video
        });

        await recursoVideo.create({
            id_recurso: recursoNuevo.id_recurso,
            id_texto_plano: videoRecurso.id_video
        });
         
    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

exports.editVideo = async (req, res) => {
    
    const {videoRecurso} = req.body;

    try {

        const {
            id_video,
            nombre, 
            video
        } = videoRecurso

        const videoExiste = await Video.findOne({ where: {id_video: id_video} });

        if(!videoExiste){
            return res.status(400).json({
                msg: "El Video no existe"
            });
        }


        if(videoExiste.nombre !== nombre || videoExiste.video !== video ){
            
            await textoPlano.update({
                nombre: nombre,
                video: video
            }, { where: {id_video: id_video} });

            return res.status(200).json({ msg: "Video actualizado exitosamente" });

        }

        return res.status(400).json({ msg: "No hay cambios para realizar" });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

exports.getVideo = async (req, res) =>{

    const { id_video } = req.body;

    try{
        
        const video = await Recurso.findOne({where:{id_video: id_video}});

        if(!video){
            return res.status(400).json({
                msg: "No se ha encontrado el video"
            });
        }

        res.status(200).json({
            texto
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }



}

exports.deleteVideo = async (req, res) => {

    const { video } = req.body;

    try {

        const { id_recurso, id_video } = video;

        const recurso = await Recurso.findOne({ where:{id_recurso: id_recurso} });
        const videoRecurso = await Video.findOne({ where:{ id_video: id_video} });

        if(!recurso || !videoRecurso){
            return res.status(400).json({
                msg: "El video no existe"
            });
        }

        await recursoVideo.destroy({
            id_recurso: id_recurso,
            id_video: id_video
        });

        await Video.destroy({
            id_video: id_video
        });

        await moduloRecurso.destroy({
            where: {
                id_recurso: id_recurso
            }
        });

        await Recurso.destroy({
            where: {
                id_recurso: id_recurso
            }
        });

        res.status(200).json({
            msg: "Video eliminado exitosamente"
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}
