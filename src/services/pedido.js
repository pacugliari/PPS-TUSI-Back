const pedidoRepository = require("../repositories/pedido");
const HttpError = require("../utils/http-error");

const getAllService = async (req) => {
    const pedidos = await pedidoRepository.findAll();
    return pedidos;
};

const getByIdService = async (req) => {
    const { id } = req.params;
    const pedido = await pedidoRepository.findById(id);
    
    if (!pedido) {
        throw new HttpError(404, "Pedido no encontrado");
    }
    
    return pedido;
};

module.exports = {
    getAllService,
    getByIdService
};
