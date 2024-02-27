const { Op } = require("sequelize");
const Hito = require("../models/hito");
const lineaTiempo = require("../models/linea_tiempo");

exports.newHito = async (req, res) =>{

    try{

        const {
            id_linea_tiempo,
            titulo,
            descripcion,
            fecha,
            imagen,
            archivo,
            enlace
        } = req.body;

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

    try{

        const {
            id_hito,
            titulo,
            descripcion,
            fecha,
            imagen,
            archivo,
            enlace
        } = req.body;

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

    const id = req.params.id;

    try{

        const hitoExiste = await Hito.findOne({ where: {id_hito: id} });

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

exports.getHito = async (req, res) => {

    const id = req.params.id;

    try{

        const hitoExiste = await Hito.findOne({
            where: { id_hito: id }
        });

        if(!hitoExiste){
            res.status(400).json({
                msg: "No exite el hito"
            });
        }

        res.json({hitoExiste}); 

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

exports.getHitos = async (req, res) => {

    const id = req.params.id;

    try{

        const hitos = await Hito.findAll({
            where: { id_linea_tiempo: id }
        });

        if(!hitos){
            res.status(400).json({
                msg: "No exite algún hito"
            });
        }

        res.json({hitos}); 

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}