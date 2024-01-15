const Activity = require("../models/actividad");
const actividadTarea = require("../models/actividad_tarea");
const moduloActividad = require("../models/modulo_actividad");
const Tarea = require("../models/tarea");


exports.newTarea = async (req, res) => {

    const {tarea} = req.body;

    try{

        const {
            id_modulo, 
            actividad, 
            nombre, 
            indicacion, 
            archivo, 
            texto
        } = tarea;

        const NuevaActividad = await Activity.create({
            nombre:actividad
        });

        await moduloActividad.create({
            id_modulo,
            id_actividad: NuevaActividad.id_actividad
        });

        const nuevaTarea = await Tarea.create({
            nombre, 
            indicacion, 
            archivo, 
            texto
        });

        await actividadTarea.create({
            id_actividad: NuevaActividad.id_actividad,
            id_tarea: nuevaTarea.id_tarea
        });

        res.status(200).json({
            msg: "Tarea creada exitosamente"
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

exports.editTarea = async (req, res) => {

    const {tarea} = req.body;

    try{

        const {
            id_tarea, 
            nombre, 
            indicacion, 
            archivo, 
            texto
        } = tarea;

        const tareaExiste = await Tarea.findOne({
            where: {
                id_tarea
            }
        });

        if(!tareaExiste){
            return res.status(400).json({
                msg: "No se ha encontrado la tarea"
            });
        }

        let cambiosRealizados = false;

        if(tareaExiste.nombre !== nombre) {
            tareaExiste.nombre = nombre;
            cambiosRealizados = true;
        }

        if(tareaExiste.indicacion !== indicacion) {
            tareaExiste.indicacion = indicacion;
            cambiosRealizados = true;
        }

        if(tareaExiste.archivo !== archivo) {
            tareaExiste.archivo = archivo;
            cambiosRealizados = true;
        }

        if(tareaExiste.texto !== texto) {
            tareaExiste.texto = texto;
            cambiosRealizados = true;
        }

        if (cambiosRealizados) {
            await tareaExiste.save();
            res.status(200).json({
                msg: "Tarea actualizada exitosamente"
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

exports.deleteTarea = async (req, res) => {

    const { tarea } = req.body;

    try {

        const { id_actividad, id_tarea } = tarea;

        const tareaExiste = await Tarea.findOne({
            where: {
                id_tarea
            }
        });

        const actividad = await Activity.findOne({
            where: {
                id_actividad
            }
        });

        if(!actividad || !tareaExiste){
            return res.status(400).json({
                msg: "Tarea no existe"
            });
        }

        await actividadTarea.destroy({
            where:{
                id_actividad,
                id_tarea
            }
        });

        await Tarea.destroy({
            where: {
                id_tarea
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

exports.getTarea = async (req, res) => {

    const id = req.params.id;

    try{

        const tareaExiste = await Tarea.findOne({
            where: {
                id_tarea: id
            }
        });

        if(!tareaExiste){
            return res.status(400).json({
                msg: "No se ha encontrado la tarea"
            });
        }

        res.status(200).json({
            Tarea: tareaExiste
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }
    
}

exports.getTareasAll = async (req, res) => {

    const id = req.params.id;

    try{

        const modulo_actividad = await moduloActividad.findAll({
            where: {
                id_modulo: id
            }
        });

        const idActividades = modulo_actividad.map(modulo_actividades => modulo_actividades.id_actividad);

        const tareaActividades = await actividadTarea.findAll({
            where: {
                id_actividad: idActividades
            }
        });

        const idTarea = tareaActividades.map(tareaActivity => tareaActivity.id_notas);

        const tarea = await Tarea.findAll({
            where: {
                id_tarea: idTarea
            }
        });

        if(!tarea){
            return res.status(400).json({
                msg: "No se ha encontrado las tareas"
            });
        }

        res.status(200).json({
            Tareas: tarea
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}