const  Evaluation  = require("../models/evaluacion");
const  MatchEvaluation  = require("../models/evaluacion_empareja");
const  SelectEvaluation  = require("../models/evaluacion_seleccion");
const  Inscrito  = require("../models/inscrito");
const  Course  = require("../models/curso");
const  ResponseEvaluation  = require("../models/respuesta_evaluacion");

const resultadoEvaluacion = async (req, res) => {

    const { preguntas } = req.body;

    try {

        let idPersona;
        let idEva;
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
            respuestas
        });

        return res.json({ msg: "Respuesta guardada exitosamente" });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

const getResultsEvaluation = async (req, res) => {

    const id = req.params.id;

    try {

        const idPersona = await ResponseEvaluation.findOne({ where: { id_persona: id } });

        if(!idPersona){
            return console.log("No hay registro");
        }

        let sumaPonderadoPuntaje = 0;

        for (const pregunta of preguntas) {
          const { opcion, puntaje } = pregunta;
          const valorPonderado = opcion && opcion.ponderado;
        
          if (typeof valorPonderado === typeof puntaje) {
            const valor = valorPonderado === puntaje ? valorPonderado : 0;
            sumaPonderadoPuntaje += valor;
          }
        }

        res.json(sumaPonderadoPuntaje);

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}

module.exports = {
    resultadoEvaluacion,
    getResultsEvaluation
}