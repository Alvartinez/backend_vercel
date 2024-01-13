const { Op } = require("sequelize");
const Hito = require("../models/hito");
const lineaTiempo = require("../models/linea_tiempo");
const Recurso = require("../models/recurso");
const recursoLinea = require("../models/recurso_linea");
const moduloRecurso = require("../models/modulo_recurso");


exports.newLine = async (req, res) => {
    
    const {line} = req.body;

    try {

        const {id_modulo, recurso, nombre} = line;

        const nuevaLinea = await lineaTiempo.findOne({ where: {
            titulo: {
                 [Op.iLike]: `%${nombre}%` 
                }
        } });

        if(nuevaLinea){
            return res.status(400).json({
                msg: "El nombre de la línea del tiempo ya existe, prueba con otro"
            });
        }

        const recursoNuevo = await Recurso.create({
            nombre: recurso
        });

        await moduloRecurso.create({
            id_modulo,
            id_recurso: recursoNuevo.id_recurso
        });

        const linea = await lineaTiempo.create({
            titulo: nombre
        });

        await recursoLinea.create({
            id_recurso: recursoNuevo.id_recurso,
            id_linea_tiempo: linea.id_linea_tiempo
        });

        res.status(200).json({
            msg: "Línea del tiempo creada satisfactoriamente"
        });
         
    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

exports.editLine = async (req, res) => {
    
    const {line} = req.body;

    try {

        const {
            id_linea_tiempo,
            titulo
        } = line;

        const lineaExiste = await lineaTiempo.findOne({
            where: {
                [Op.or]:[
                    {id_linea_tiempo: id_linea_tiempo},
                    {titulo: {[Op.iLike]: `%${titulo}%`}}
                ]
            } 
        });

        if(!lineaExiste){
            return res.status(400).json({
                msg: "La linea del tiempo no existe"
            });
        }

        if(lineaExiste.titulo !== titulo ){
            
            await lineaTiempo.update({
                titulo: titulo
            }, { where: {id_linea_tiempo: id_linea_tiempo} });

            return res.status(200).json({ msg: "Linea del tiempo actualizada exitosamente" });

        }

        return res.status(400).json({ msg: "No hay cambios para realizar" });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

exports.deleteLine = async (req, res) => {

    const { line } = req.body;

    try {

        const { id_recurso, id_linea_tiempo } = line;

        const recurso = await Recurso.findOne({ where:{id_recurso: id_recurso} });
        const linea_tiempo = await lineaTiempo.findOne({ where:{ id_linea_tiempo: id_linea_tiempo} });
        const hitos = await Hito.findAll({ where: { id_linea_tiempo: id_linea_tiempo } });

        if(!recurso || !linea_tiempo){
            return res.status(400).json({
                msg: "La linea del tiempo no existe"
            });
        }

        if (hitos.length > 0) {
            await Hito.destroy({ where: { id_linea_tiempo: id_linea_tiempo } });
        }

        await recursoLinea.destroy({
            where: {
                id_recurso: id_recurso,
                id_linea_tiempo: id_linea_tiempo
            }
        });

        await lineaTiempo.destroy({
            where: {
                id_linea_tiempo: id_linea_tiempo
            }
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
            msg: "Linea del tiempo eliminada exitosamente"
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

exports.getLine = async (req, res) =>{

    const id = req.params.id;

    try{
        
        const linea = await lineaTiempo.findOne({
            where:{
                id_linea_tiempo: id
            }
        });

        if(!linea){
            return res.status(400).json({
                msg: "No se ha encontrado la línea del tiempo"
            });
        }

        const hitos = await Hito.findAll({
            where: {
              id_linea_tiempo: id
            },
            attributes: ["fecha", "titulo"]
        });

        const response = {
            linea: linea,
            hitos: hitos
          };

        res.status(200).json({
            response
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

exports.getLines = async (req, res) => {

    const id = req.params.id; // Este es id_modulo

    try{

        const Recursos = await moduloRecurso.findAll({
            where: {
                id_modulo: id
            }
        });

        const recursosLineaTiempo = Recursos.filter(Recurso =>
            Recurso.nombre === "Linea del tiempo"
        );

        res.status(200).json({
            recursos: recursosLineaTiempo
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}
