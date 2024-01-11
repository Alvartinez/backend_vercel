const moduloRecurso = require("../models/modulo_recurso");
const Recurso = require("../models/recurso");
const recursoVideo = require("../models/recurso_video");
const Video = require("../models/video");


exports.newVideo = async (req, res) => {
    
    const { videoNuevo } = req.body;

    try {
        const { id_modulo, recurso, nombre, video } = videoNuevo;

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
    const { videoRecurso } = req.body;

    try {
        const { id_video, nombre, video } = videoRecurso;

        const videoExiste = await Video.findOne({ where: { id_video: id_video } });

        if (!videoExiste) {
            return res.status(400).json({
                msg: "El Video no existe"
            });
        }

        // Verifica si las propiedades son diferentes de null antes de actualizar
        const updateData = {};
        if (nombre !== null && nombre !== undefined && videoExiste.nombre !== nombre) {
            updateData.nombre = nombre;
        }

        if (video !== null && video !== undefined && videoExiste.video !== video) {
            updateData.video = video;
        }

        if (Object.keys(updateData).length > 0) {
            // Solo realiza la actualización si hay cambios
            await Video.update(updateData, { where: { id_video: id_video } });
            return res.status(200).json({ msg: "Video actualizado exitosamente" });
        } else {
            return res.status(200).json({ msg: "No hay cambios por realizar" });
        }

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
