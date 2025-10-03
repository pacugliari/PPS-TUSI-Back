const ordenCompraRepository = require("../repositories/ordencompra");
const HttpError = require("../utils/http-error");

const getAllService = async (req) => {
    const ordenesCompra = await ordenCompraRepository.findAll();
    return ordenesCompra;
};

const getByIdService = async (req) => {
    const { id } = req.params;
    const ordenCompra = await ordenCompraRepository.findById(id);
    
    if (!ordenCompra) {
        throw new HttpError(404, "Orden de compra no encontrada");
    }
    
    return ordenCompra;
};

module.exports = {
    getAllService,
    getByIdService
};
