const envioRepository = require("../repositories/envio");
const HttpError = require("../utils/http-error");

const getAllService = async (req) => {
    const envios = await envioRepository.findAll();
    return envios;
};

const getByIdService = async (req) => {
    const { id } = req.params;
    const envio = await envioRepository.findById(id);
    
    if (!envio) {
        throw new HttpError(404, "Envío no encontrado");
    }
    
    return envio;
};

module.exports = {
    getAllService,
    getByIdService
};
