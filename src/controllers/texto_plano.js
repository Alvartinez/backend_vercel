const moduloRecurso = require("../models/modulo_recurso");
const Recurso = require("../models/recurso");
const recursoTexto = require("../models/recurso_texto");
const textoPlano = require("../models/texto_plano");

//Crear texto plano
exports.newText = async (req, res) => {
    
    const { texto } = req.body;

    try {
        const { id_modulo, nombre,  recurso } = texto;

        const recursoNuevo = await Recurso.create({
            nombre:recurso
        });

        await moduloRecurso.create({
            id_modulo,
            id_recurso: recursoNuevo.id_recurso
        });

        const plano = await textoPlano.create({
            titulo: nombre
        });

        await recursoTexto.create({
            id_recurso: recursoNuevo.id_recurso,
            id_texto_plano: plano.id_texto_plano
        });

        res.status(200).json({
            msg: "Entrada creada exitosamente"
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }
}

exports.editText = async (req, res) => {
    
    const {texto} = req.body;

    try {

        const {
            id_texto_plano,
            titulo,
            parrafo,
            imagen,
            archivo,
            subtitulo
        } = texto

        const textoExiste = await textoPlano.findOne({ where: {id_texto_plano: id_texto_plano} });

        if(!textoExiste){
                        return res.status(400).json({
                msg: "El texto plano no existe"
            });
        }


        if(textoExiste.titulo !== titulo || textoExiste.parrafo !== parrafo ||
            textoExiste.imagen !== imagen || textoExiste.archivo !== archivo ||
            textoExiste.subtitulo !== subtitulo ){
            
            await textoPlano.update({
                titulo: titulo,
                parrafo: parrafo,
                imagen: imagen,
                archivo: archivo,
                subtitulo: subtitulo
            }, { where: {id_texto_plano: id_texto_plano} });

            return res.status(200).json({ msg: "Texto plano actualizado exitosamente" });

        }

        return res.status(400).json({ msg: "No hay cambios para realizar" });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

exports.deleteText = async (req, res) => {

    const { texto } = req.body;

    try {

        const { id_recurso, id_texto_plano } = texto;

        const recurso = await Recurso.findOne({ where:{id_recurso: id_recurso} });
        const texto_plano = await textoPlano.findOne({ where:{ id_texto_plano: id_texto_plano} });

        if(!recurso || !texto_plano){
            return res.status(400).json({
                msg: "El texto plano no existe"
            });
        }

        await recursoTexto.destroy({
            id_recurso: id_recurso,
            id_texto_plano: id_texto_plano
        });

        await textoPlano.destroy({
            id_texto_plano: id_texto_plano
        });

        res.status(200).json({
            msg: "Texto plano eliminado exitosamente"
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

exports.getText = async (req, res) =>{

    const { id_texto_plano } = req.body;

    try{
        
        const texto = await textoPlano.findOne({where:{id_texto_plano: id_texto_plano}});

        if(!texto){
            return res.status(400).json({
                msg: "No se ha encontrado el texto plano"
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