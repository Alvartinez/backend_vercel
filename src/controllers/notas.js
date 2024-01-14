const Activity = require("../models/actividad");
const actividadNotas = require("../models/actividad_notas");
const moduloActividad = require("../models/modulo_actividad");
const Notes = require("../models/notas");


exports.newNotas = async (req, res) => {

    const {notas} = req.body;

    try{

        const {
            id_modulo, 
            actividad, 
            nombre, 
            instruccion, 
            imagen, 
            video, 
            archivo, 
            texto
        } = notas;

        const NuevaActividad = await Activity.create({
            nombre:actividad
        });

        await moduloActividad.create({
            id_modulo,
            id_actividad: NuevaActividad.id_actividad
        });

        const nuevaNotas = await Notes.create({
            nombre, 
            instruccion, 
            imagen, 
            video, 
            archivo, 
            texto
        });

        await actividadNotas.create({
            id_actividad: NuevaActividad.id_actividad,
            id_notas: nuevaNotas.id_notas
        });

        res.status(200).json({
            msg: "Nota creada exitosamente"
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

exports.editNotas = async (req, res) => {

    const {notas} = req.body;

    try{

        const {
            id_notas, 
            nombre, 
            instruccion, 
            imagen, 
            video, 
            archivo, 
            texto
        } = notas;

        const notaExiste = await Notes.findOne({
            where: {
                id_notas
            }
        });

        if(!notaExiste){
            return res.status(400).json({
                msg: "No se ha encontrado la nota"
            });
        }

        let cambiosRealizados = false;

        if(notaExiste.nombre !== nombre) {
            notaExiste.nombre = nombre;
            cambiosRealizados = true;
        }

        if(notaExiste.instruccion !== instruccion) {
            notaExiste.instruccion = instruccion;
            cambiosRealizados = true;
        }

        if(notaExiste.imagen !== imagen) {
            notaExiste.imagen = imagen;
            cambiosRealizados = true;
        }

        if(notaExiste.video !== video) {
            notaExiste.video = video;
            cambiosRealizados = true;
        }

        if(notaExiste.archivo !== archivo) {
            notaExiste.archivo = archivo;
            cambiosRealizados = true;
        }

        if(notaExiste.texto !== texto) {
            notaExiste.texto = texto;
            cambiosRealizados = true;
        }

        if (cambiosRealizados) {
            await notaExiste.save();
            res.status(200).json({
                msg: "Nota actualizada exitosamente"
            });
        } else {
            res.status(200).json({
                msg: "No se realizaron cambios en la Nota"
            });
        }

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }
    
}

exports.deleteNota = async (req, res) => {

    const { notas } = req.body;

    try {

        const { id_actividad, id_notas } = notas;

        const notaExiste = await Notes.findOne({
            where: {
                id_notas
            }
        });

        const actividad = await Activity.findOne({
            where: {
                id_actividad
            }
        });

        if(!actividad || !notaExiste){
            return res.status(400).json({
                msg: "Nota no existe"
            });
        }

        await actividadNotas.destroy({
            where:{
                id_actividad,
                id_notas
            }
        });

        await Notes.destroy({
            where: {
                id_notas
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

exports.getNota = async (req, res) => {

    const id = req.params.id;

    try{

        const notaExiste = await Notes.findOne({
            where: {
                id_notas: id
            }
        });

        if(!notaExiste){
            return res.status(400).json({
                msg: "No se ha encontrado la nota"
            });
        }

        res.status(200).json({
            Nota: notaExiste
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }
    
}

exports.getNotasAll = async (req, res) => {

    const id = req.params.id;

    try{

        const modulo_actividad = await moduloActividad.findAll({
            where: {
                id_modulo: id
            }
        });

        const idActividades = modulo_actividad.map(modulo_actividades => modulo_actividades.id_actividad);

        const notaActividades = await actividadNotas.findAll({
            where: {
                id_actividad: idActividades
            }
        });

        const idNotas = notaActividades.map(notaActivity => notaActivity.id_notas);

        const nota = await Notes.findAll({
            where: {
                id_notas: idNotas
            }
        });

        if(!nota){
            return res.status(400).json({
                msg: "No se ha encontrado las notas"
            });
        }

        res.status(200).json({
            Notas: nota
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}