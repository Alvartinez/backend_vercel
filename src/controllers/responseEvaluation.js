const  Evaluation  = require("../models/evaluacion");
const  MatchEvaluation  = require("../models/evaluacion_empareja");
const  SelectEvaluation  = require("../models/evaluacion_seleccion");
const  Inscrito  = require("../models/inscrito");
const  Course  = require("../models/curso");
const  ResponseEvaluation  = require("../models/respuesta_evaluacion");

exports.resultadoEvaluacion = async (req, res) => {

    const { preguntas } = req.body;

    try {

        let idPersona;
        let idEva;
        let intenta;
        let intentosActuales;
        const respuestas = [];

        for (const pregunta of preguntas) {
            const {
                id_persona,
                id_evaluacion,
                id_pregunta,
                enunciado,
                opcion,
                tipo_pregunta,
                multiple,
                puntaje,
                fecha_respuesta
            } = pregunta;

            if (!idPersona && !idEva) {
                idPersona = id_persona;
                idEva = id_evaluacion;
            }

            let evaPregunta;
            console.log(id_evaluacion);
            if (tipo_pregunta === 'seleccion') {
                evaPregunta = await SelectEvaluation.findOne({ where: { id_seleccion: id_pregunta } });
                console.log("Soy una pregunta de seleccion XD");

            } else if (tipo_pregunta === 'empareja') {
                evaPregunta = await MatchEvaluation.findOne({ where: { id_empareja: id_pregunta } });
                console.log("Soy una pregunta de emparejar XD");

            } else {
                return res.status(400).json({ msg: "Tipo de pregunta no válido" });
            }

            const evaluacion = await Evaluation.findOne({ where: { id_evaluacion: id_evaluacion } });

            if (!evaluacion) {
                return res.status(400).json({ msg: "La evaluación no existe" });
            }

            intenta = evaluacion.intentos;

            const cursoExiste = await Course.findOne({ where: { id_curso: evaluacion.id_curso } });

            if (!cursoExiste) {
                return res.status(400).json({ msg: "El curso no existe" });
            }

            const estaInscrito = await Inscrito.findOne({
                where: { id_persona, id_curso: cursoExiste.id_curso }
            });

            if (!estaInscrito) {
                return res.status(400).json({ msg: "El usuario no está inscrito en el curso" });
            }

            respuestas.push({
                id_persona,
                id_evaluacion,
                id_pregunta,
                enunciado,
                opcion,
                tipo_pregunta,
                multiple,
                puntaje,
                fecha_respuesta
            });

        }

        // Guardar la respuesta en la tabla respuesta_quiz
        await ResponseEvaluation.create({
            id_persona: idPersona,
            id_evaluacion: idEva,
            respuestas,
            intentos: intentosActuales
        });

        return res.json({ msg: "Respuesta guardada exitosamente" });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

exports.getResultsEvaluation = async (req, res) => {

    const id = req.params.id;

    try {

        const idPersona = await ResponseEvaluation.findOne({ where: { id_persona: id } });

        console.log(idPersona);

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}