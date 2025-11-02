const { PedidoState } = require("../state");
const { ESTADOS_PEDIDOS } = require("../../../constants/pedidos");

class Cancelado extends PedidoState {
  name() {
    return ESTADOS_PEDIDOS.CANCELADO;
  }
  allowed() {
    return [];
  }

  async to() {
    return this.ctx._reject("Pedido cancelado — sin transiciones posibles");
  }
}

module.exports = { Cancelado };
