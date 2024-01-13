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
            msg: "Texto Plano creado exitosamente"
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


        // Eliminar la relación entre recurso y texto_plano
        await recursoTexto.destroy({
            where: {
                id_recurso: id_recurso,
                id_texto_plano: id_texto_plano
            }
        });

        // Eliminar el texto_plano
        await textoPlano.destroy({
            where: {
                id_texto_plano: id_texto_plano
            }
        });

        // Eliminar la relación entre modulo y recurso
        await moduloRecurso.destroy({
            where: {
                id_recurso: id_recurso
            }
        });

        // Eliminar el recurso
        await Recurso.destroy({
            where: {
                id_recurso: id_recurso
            }
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

    const id = req.params.id;

    try{
        
        const texto = await textoPlano.findOne({where:{id_texto_plano: id}});

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

exports.getTexts = async (req, res) => {

    const id = req.params.id;

    try{

        const moduloRecursos = await moduloRecurso.findAll({
            where: {
                id_modulo: id
            }
        });

        const idRecursos = moduloRecursos.map(moduloRecurso => moduloRecurso.id_recurso);

        const textosRecursos = await recursoTexto.findAll({
            where: {
                id_recurso: idRecursos
            }
        });

        const idtexto = textosRecursos.map(textRecurso => textRecurso.id_texto_plano);

        
        const texto = await textoPlano.findAll({where:{id_texto_plano: idtexto}});

        if(!texto){
            return res.status(400).json({
                msg: "No se ha encontrado el Sabías qué"
            });
        }

        res.status(200).json({
            Textos_Planos: texto
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}
