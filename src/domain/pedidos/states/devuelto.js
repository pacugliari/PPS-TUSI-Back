const { PedidoState } = require("../state");
const { ESTADOS_PEDIDOS } = require("../../../constants/pedidos");
class Devuelto extends PedidoState {
  name() {
    return ESTADOS_PEDIDOS.DEVUELTO;
  }
  allowed() {
    return [];
  }

  async to() {
    return this.ctx._reject("Pedido devuelto — sin transiciones posibles");
  }
}

module.exports = { Devuelto };
