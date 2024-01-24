const Competence = require("../models/competencia");
const Course = require("../models/curso");
const comptCourse = require("../models/curso_competencia");


exports.newCompetence = async (req, res) => {
    const id = req.params.id;
    const competencias = req.body;

    try {

        const curso = await Course.findByPk(id);

        const nuevaCompetencia = await Competence.create({ competencia: competencias });

        await comptCourse.create({
            id_curso: curso.id_curso,
            id_competencia: nuevaCompetencia.id_competencia
        });

        res.status(200).json({msg: "Competencias creadas exitosamente"});
    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: "Se ha producido un error" });
    }
};


exports.getCompetences = async (req, res) => {
    const id = req.params.id;

    try {
        const curso = await Course.findOne({
            where: {id_curso: id}
        });

        if (!curso) {
            return res.status(400).json("No existe el curso");
        }

        const curso_competencia = await comptCourse.findOne({
            where: { id_curso: curso.id_curso },
        });

        if (!curso_competencia) {
            return res.status(400).json({ msg: "No hay competencias para este curso" });
        }

        const competencias = await Competence.findOne({
            where: { id_competencia: curso_competencia.id_competencia },
        });

        if (!competencias) {
            return res.status(400).json({ msg: "No existen competencias para este curso" });
        }

        res.json(competencias);
    
    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: "Se ha producido un error" });
    }
}

exports.editCompetence = async (req, res) => {
    const id = req.params.id;
    const { competencia } = req.body;

    try {

        const competenciaExistente = await Competence.findByPk(id);

        if (!competenciaExistente) {
            return res.status(404).json({ msg: "Competencia no encontrada" });
        }

        await competenciaExistente.update({ competencia });

        res.status(200).json({msg: "Competencias modificadas"});
    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: "Se ha producido un error al actualizar la competencia" });
    }
};

exports.deleteCompetence = async (req, res) => {
    const id = req.params.id;

    try {
        const competencia = await Competence.findByPk(id);

        if (!competencia) {
            return res.status(404).json({ msg: "Competencia no encontrada" });
        }

        const cursoExiste = await comptCourse.findOne({
            where: {id_competencia: competencia.id_competencia}
        });

        await cursoExiste.destroy();

        await competencia.destroy();

        res.json({ msg: "Competencia eliminada exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: "Se ha producido un error al eliminar la competencia" });
    }
}
