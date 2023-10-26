const Modulo = require('../models/modulo');
const Quiz = require('../models/quiz_formativo');

// Obtener un módulo en específico
const getModule = async (req, res) => {
    const id = req.params.id;

    try {
        const infoModulo = await Modulo.findOne({
            where: { id_modulo: id },
            include: [
                {
                    model: Quiz,
                    as: 'quiz_formativo',
                    attributes: ['id_modulo', 'titulo']
                }
            ]
        });

        if (!infoModulo) {
            res.status(400).json({
                msg: 'No se encuentra información, comuníquese con el Admin'
            });
        }

        res.json(infoModulo);
    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }
};

module.exports = {
    getModule
};