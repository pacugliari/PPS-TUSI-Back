const itemOrdenCompraRepository = require("../repositories/itemordencompra");
const HttpError = require("../utils/http-error");

const getAllService = async (req) => {
    const itemsOrdenCompra = await itemOrdenCompraRepository.findAll();
    return itemsOrdenCompra;
};

const getByIdService = async (req) => {
    const { id } = req.params;
    const itemOrdenCompra = await itemOrdenCompraRepository.findById(id);
    
    if (!itemOrdenCompra) {
        throw new HttpError(404, "Item de orden de compra no encontrado");
    }
    
    return itemOrdenCompra;
};

module.exports = {
    getAllService,
    getByIdService
};
