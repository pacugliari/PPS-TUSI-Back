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

const getOrdersByUserService = async (req) => {
    const idUsuario = req.user.id;
    if (!idUsuario) throw new HttpError(401, "Usuario no autenticado");
    const rows = await pedidoRepository.findByUserId(idUsuario);
    return rows;
};

const getOrderDetailByIdService = async (req) => {
    const idUsuario = req.user.id;
    if (!idUsuario) throw new HttpError(401, "Usuario no autenticado");
    const { id } = req.params;
    const pedido = await pedidoRepository.findByIdAndUserWithItems(id, idUsuario);
    if (!pedido) throw new HttpError(404, "Pedido no encontrado");

    // Mapear items al formato solicitado
    const items = (pedido.detalles || []).map(d => ({
        articulo: d.producto?.nombre,
        precio: d.precio,
        cantidad: d.cantidad,
        subtotal: d.precio && d.cantidad ? String(Number(d.precio) * Number(d.cantidad)) : null,
    }));

    return {
        idPedido: pedido.idPedido,
        items,
        total: pedido.total,
    };
};

module.exports = {
    getAllService,
    getByIdService,
    getOrdersByUserService,
    getOrderDetailByIdService,
};
