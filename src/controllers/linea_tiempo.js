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

        if(!nuevaLinea){
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
                [Op.and]:[
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
            id_recurso: id_recurso,
            id_linea_tiempo: id_linea_tiempo
        });

        await lineaTiempo.destroy({
            id_linea_tiempo: id_linea_tiempo
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

    const { id_linea_tiempo } = req.body;

    try{
        
        const linea = await Recurso.findOne({
            where:{
                id_linea_tiempo: id_linea_tiempo
            },
            include: [
                {
                    model: Hito, 
                    as: 'hito',
                    attributes: ["fecha","titulo"] 
                }
            ]
        });

        if(!linea){
            return res.status(400).json({
                msg: "No se ha encontrado la línea del tiempo"
            });
        }

        res.status(200).json({
            linea
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

exports.newHito = async (req, res) =>{

    const {hito} = req.body;

    try{

        const {
            id_linea_tiempo,
            titulo,
            descripcion,
            fecha,
            imagen,
            archivo,
            enlace
        } = hito;

        const linea = await lineaTiempo.findOne({ where:{id_linea_tiempo: id_linea_tiempo} });

        if(!linea){
            return res.status(400).json({
                msg: "La linea del tiempo no existe"
            });
        }

        let idHito;

        if (imagen) {
            idHito = await Hito.create({
                id_linea_tiempo: id_linea_tiempo,
                titulo: titulo,
                descripcion: descripcion,
                fecha: fecha,
                imagen: imagen
            });
        } else {
            idHito = await Hito.create({
                id_linea_tiempo: id_linea_tiempo,
                titulo: titulo,
                descripcion: descripcion,
                fecha: fecha
            });
        }

        const updateData = {};

        if (archivo) {
          updateData.archivo = archivo;
        }

        if (enlace) {
          updateData.enlace = enlace;
        }

        if (Object.keys(updateData).length > 0) {
          await Hito.update(updateData, { where: { id_hito: idHito.id_hito } });
        }

        return res.status(200).json({ msg: "Hito " + titulo + " creado exitosamente" });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

exports.editHito = async (req, res) =>{

    const { hito } = req.body;

    try{

        const {
            id_hito,
            titulo,
            descripcion,
            fecha,
            imagen,
            archivo,
            enlace
        } = hito;

        const hitoExiste = await Hito.findOne({ where: {id_hito} }); 

        if(!hitoExiste){
            return res.status(400).json({
                msg: "No existe el hito "+titulo
            });
        }

        const lineaHito = await lineaTiempo.findOne({id_linea_tiempo: hitoExiste.id_linea_tiempo});

        if(!lineaHito){
            return res.status(400).json({
                msg: "No existe el hito "+titulo+" en la línea de tiempo "+lineaHito.titulo
            });
        }

        if(hitoExiste.titulo !== titulo || hitoExiste.descripcion !== descripcion ||
            hitoExiste.fecha !== fecha || hitoExiste.imagen !== imagen || 
            hitoExiste.archivo !== archivo || hitoExiste.enlace !== enlace){
            
            await Hito.update({
                titulo: titulo,
                descripcion: descripcion,
                fecha: fecha,
                imagen: imagen,
                archivo: archivo,
                enlace: enlace
            },
            {
                where: { id_hito: hitoExiste.id_hito }
            });

            return res.status(200).json({ msg: "Hito actualizado exitosamente" });
        }

        return res.status(400).json({ msg: "No hay cambios para realizar" });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

exports.deleteHito = async (req, res) => {

    const {id_hito} = req.body;

    try{

        const hitoExiste = await Hito.findOne({ where: {id_hito: id_hito} });

        if(!hitoExiste){
            return res.status(400).json({
                msg: "No existe el hito"
            });
        }

        const hitoEliminado = await Hito.destroy({ where: {id_hito: hitoExiste.id_hito} });

        if(hitoEliminado > 0){
            return res.status(200).json({
                msg: "Hito eliminado"
            });
        }

        return res.status(400).json({
            msg: "Hito no fue eliminado extosamente"
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}