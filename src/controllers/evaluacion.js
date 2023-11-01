const Evaluation = require("../models/evaluacion");
const  MatchEvaluation  = require("../models/evaluacion_empareja");
const  SelectEvaluation  = require("../models/evaluacion_seleccion");
const  Match  = require("../models/empareja");
const  Select  = require("../models/seleccion");

exports.getEvaluacion = async (req, res) => {
    const id = req.params.id;

    try {
        const evaluacion = await Evaluation.findOne({
            where: { id_evaluacion: id },
            include: [
                {
                    model: MatchEvaluation,
                    as: 'evaluacion_empareja',
                    include: [
                        {
                            model: Match,
                            as: 'empareja'
                        }
                    ]
                },
                {
                    model: SelectEvaluation,
                    as: 'evaluacion_seleccion',
                    include: [
                        {
                            model: Select,
                            as: 'seleccion'
                        }
                    ]
                }
            ]
        });

        if (!evaluacion) {
            res.status(400).json({
                msg: "No se encuentra información, comuníquese con el administrador"
            });
        }

        res.json(evaluacion);

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha producido un error' });
    }
};