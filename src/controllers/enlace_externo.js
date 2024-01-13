

exports.newEnlace = async (req, res) => {

    const {enlace} = req.body;

    try{

        const {
            
        } = enlace;

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Se ha ocurrido un error' });
    }

}