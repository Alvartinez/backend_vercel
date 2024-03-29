const moduloRecurso = require("../models/modulo_recurso");
const Recurso = require("../models/recurso");
const recursoSabias = require("../models/recurso_sabias");
const sabiasQue = require("../models/sabias_que");

exports.newSabias = async (req, res) => { 

    try{

        const {id_modulo, recurso, titulo, enunciado, archivo, imagen} = req.body;

        const recursoNuevo = await Recurso.create({
            nombre:recurso
        });

        await moduloRecurso.create({
            id_modulo,
            id_recurso: recursoNuevo.id_recurso
        });
        
        const sabias = await sabiasQue.create({
            titulo,
            enunciado,
            archivo, 
            imagen
        });

        await recursoSabias.create({
            id_recurso: recursoNuevo.id_recurso,
            id_sabias_que: sabias.id_sabias_que
        });

        res.status(200).json({
            msg: "Sabías qué creado exitosamente"
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

exports.editSabias = async (req, res) => {

    try{

        const {
            id_sabias_que, 
            titulo, 
            enunciado, 
            imagen, 
            archivo
        } = req.body;

        const sabiaExiste = await sabiasQue.findOne({
            where: {
                id_sabias_que
            }
        });

        if(!sabiaExiste){
            return res.status(400).json({
                msg: "No se ha encontrado el Sabías qué"
            });
        }

        let cambiosRealizados = false;

        if (sabiaExiste.titulo !== titulo) {
            sabiaExiste.titulo = titulo;
            cambiosRealizados = true;
        }

        if (sabiaExiste.enunciado !== enunciado) {
            sabiaExiste.enunciado = enunciado;
            cambiosRealizados = true;
        }

        if (sabiaExiste.imagen !== imagen) {
            sabiaExiste.imagen = imagen;
            cambiosRealizados = true;
        }

        if (sabiaExiste.archivo !== archivo) {
            sabiaExiste.archivo = archivo;
            cambiosRealizados = true;
        }

        if (cambiosRealizados) {
            await sabiaExiste.save();
            res.status(200).json({
                msg: "Sabías qué actualizado exitosamente"
            });
        } else {
            res.status(200).json({
                msg: "No se realizaron cambios en el Sabías qué"
            });
        }

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

exports.deleteSabias = async (req, res) => {

    try{

        const id = req.params.id;

        const sabias = await sabiasQue.findOne({
            where: {
                id_sabias_que: id
            }
        });

        const recurso_Sabias = await recursoSabias.findOne({
            where:{
              id_sabias_que: sabias. id_sabias_que
            } 
        });

        const recurso = await Recurso.findOne({ where:{id_recurso: recurso_Sabias.id_recurso} });

        if(!recurso || !sabias){
            return res.status(400).json({
                msg: "Sabías qué no existe"
            });
        }

        await recursoSabias.destroy({
            where: {
                id_recurso: recurso.id_recurso,
                id_sabias_que: id
            }
        });

        await sabiasQue.destroy({
            where: {
                id_sabias_que: id
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
            msg: "Sabías qué eliminado exitosamente"
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

exports.getSabias = async (req, res) => {

    const id = req.params.id;

    try{

        const sabiaExiste = await sabiasQue.findOne({
            where: {
                id_sabias_que: id
            }
        });

        if(!sabiaExiste){
            return res.status(400).json({
                msg: "No se ha encontrado el Sabías qué"
            });
        }

        res.status(200).json({
            Sabia: sabiaExiste
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

exports.getSabiasAll = async (req, res) => {

    const id = req.params.id;

    try{

        const moduloRecursos = await moduloRecurso.findAll({
            where: {
                id_modulo: id
            }
        });

        const idRecursos = moduloRecursos.map(moduloRecurso => moduloRecurso.id_recurso);

        const sabiasRecursos = await recursoSabias.findAll({
            where: {
                id_recurso: idRecursos
            }
        });

        const idsabias = sabiasRecursos.map(sabiRecurso => sabiRecurso.id_sabias_que);

        const sabia = await sabiasQue.findAll({
            where: {
                id_sabias_que: idsabias
            }
        });

        if(!sabia){
            return res.status(400).json({
                msg: "No se ha encontrado el Sabías qué"
            });
        }

        res.status(200).json({
            Sabia: sabia
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}
