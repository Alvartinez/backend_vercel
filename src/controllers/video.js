const moduloRecurso = require("../models/modulo_recurso");
const Recurso = require("../models/recurso");
const recursoVideo = require("../models/recurso_video");
const Video = require("../models/video");


exports.newVideo = async (req, res) => {

    try {
        const { id_modulo, recurso, nombre, video } = req.body;

        const recursoNuevo = await Recurso.create({
            nombre: recurso
        });

        await moduloRecurso.create({
            id_modulo,
            id_recurso: recursoNuevo.id_recurso
        });

        let videoRecurso;

        if (nombre !== undefined && nombre !== null) {
            videoRecurso = await Video.create({
                nombre: nombre,
                video: video
            });
        } else {
            // Si nombre es null o undefined, crear un video sin nombre
            videoRecurso = await Video.create({
                video: video
            });
        }

        // Verificar que se haya creado el videoRecurso antes de intentar acceder a su id_video
        if (videoRecurso) {
            await recursoVideo.create({
                id_recurso: recursoNuevo.id_recurso,
                id_video: videoRecurso.id_video
            });

            res.status(200).json({
                msg: "Video creado exitosamente"
            });
        } else {

            await Recurso.destroy({
                where: {
                    id_recurso: recursoNuevo.id_recurso
                }
            });

            res.status(400).json({
                msg: "No se pudo crear el video correctamente"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }
}

exports.editVideo = async (req, res) => {

    try {

        const {
            id_video,
            nombre, 
            video
        } = req.body;

        const videoExiste = await Video.findOne({ where: {id_video: id_video} });

        if(!videoExiste){
            return res.status(400).json({
                msg: "El Video no existe"
            });
        }


        if(videoExiste.nombre !== nombre || videoExiste.video !== video ){
            
            if (videoExiste.nombre !== nombre) {

                if (videoExiste.video !== video) {
                    await Video.update({
                        nombre: nombre,
                        video: video
                    }, { where: {id_video: id_video} });
                }else{
                    await Video.update({
                        nombre: nombre
                    }, { where: {id_video: id_video} });
                }

            }else{

                if (videoExiste.video === video) {
                    return res.status(200).json({
                        msg: "No hay cambios por realizar"
                    });
                }

                await Video.update({
                    video: video
                }, { where: {id_video: id_video} });

            }
            

            return res.status(200).json({ msg: "Video actualizado exitosamente" });

        }

        return res.status(400).json({ msg: "No hay cambios para realizar" });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

exports.getVideo = async (req, res) =>{

    const id = req.params.id;

    try{
        
        const video = await Video.findOne({where:{id_video: id}});

        if(!video){
            return res.status(400).json({
                msg: "No se ha encontrado el video"
            });
        }

        res.status(200).json({
            video
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

exports.getVideos = async (req, res) => {

    const id = req.params.id;

    try{

        const moduloRecursos = await moduloRecurso.findAll({
            where: {
                id_modulo: id
            }
        });

        const idRecursos = moduloRecursos.map(moduloRecurso => moduloRecurso.id_recurso);

        const videoRecursos = await recursoVideo.findAll({
            where: {
                id_recurso: idRecursos
            }
        });

        const idVideo = videoRecursos.map(vidRecurso => vidRecurso.id_video);

        const videos = await Video.findAll({
            where: {
                id_video: idVideo
            }
        });

        if(!videos){
            return res.status(400).json({
                msg: "No se ha encontrado Videos"
            });
        }

        res.status(200).json({
            Videos: videos
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }


}

exports.deleteVideo = async (req, res) => {

    try {

        const id = req.params.id;

        const videoRecurso = await Video.findOne({ where:{ id_video: id} });
        const recurso_Video = await recursoVideo.findOne({ where:{ id_video: videoRecurso.id_video} });
        const recurso = await Recurso.findOne({ where:{id_recurso: recurso_Video.id_recurso} });

        if(!recurso || !videoRecurso){
            return res.status(400).json({
                msg: "El video no existe"
            });
        }

        await recursoVideo.destroy({
            where: {
                id_recurso: recurso.id_recurso,
                id_video: id
            }
        });

        await Video.destroy({
            where: {
                id_video: id
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
            msg: "Video eliminado exitosamente"
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}
