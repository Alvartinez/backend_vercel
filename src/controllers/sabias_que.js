const moduloRecurso = require("../models/modulo_recurso");
const Recurso = require("../models/recurso");
const recursoSabias = require("../models/recurso_sabias");
const sabiasQue = require("../models/sabias_que");

exports.newSabias = async (req, res) => {

    const {sabia} = req.body;

    try{

        const {id_modulo, recurso, titulo} = sabia;

        const recursoNuevo = await Recurso.create({
            nombre:recurso
        });

        await moduloRecurso.create({
            id_modulo,
            id_recurso: recursoNuevo.id_recurso
        });
        
        const sabias = await sabiasQue.create({
            titulo
        });

        await recursoSabias.create({
            id_recurso: recursoNuevo.id_recurso,
            id_sabias_que: sabias.id_sabias_que
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}