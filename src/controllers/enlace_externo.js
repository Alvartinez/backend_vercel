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