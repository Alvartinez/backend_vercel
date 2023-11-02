const Quiz = require("../models/quiz_formativo");
const Match = require("../models/empareja");
const Select = require("../models/seleccion");
const QuizMatch = require("../models/quiz_empareja");
const QuizSelection = require("../models/quiz_seleccion");

const getQuiz = async (req, res) => {

    const id = req.params.id;

    try {

        const quiz = await Quiz.findOne({
            where: { id_quiz_formativo: id },
            include: [
                {
                    model: QuizMatch,
                    as: 'quiz_empareja',
                    include: [
                        {
                            model: Match,
                            as: 'empareja'
                        }
                    ]
                },
                {
                    model: QuizSelection,
                    as: 'quiz_seleccion',
                    include: [
                        {
                            model: Select,
                            as: 'seleccion'
                        }
                    ]
                }
            ]
        });

        if (!quiz) {
            res.status(400).json({
                msg: "No se encuentra información, comuníquese con el administrador"
            });
        }

        res.json(quiz);

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha producido un error' });
    }

}

module.exports = {
    getQuiz
}