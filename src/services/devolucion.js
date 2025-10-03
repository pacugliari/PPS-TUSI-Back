const devolucionRepository = require("../repositories/devolucion");
const HttpError = require("../utils/http-error");

const getAllService = async (req) => {
    const devoluciones = await devolucionRepository.findAll();
    return devoluciones;
};

const getByIdService = async (req) => {
    const { id } = req.params;
    const devolucion = await devolucionRepository.findById(id);
    
    if (!devolucion) {
        throw new HttpError(404, "Devolución no encontrada");
    }
    
    return devolucion;
};

module.exports = {
    getAllService,
    getByIdService
};
