const { PedidoState } = require("../state");
const { ESTADOS_PEDIDOS } = require("../../../constants/pedidos");
class Reservado extends PedidoState {
  name() {
    return ESTADOS_PEDIDOS.RESERVADO;
  }
  allowed() {
    return [ESTADOS_PEDIDOS.ENTREGADO, ESTADOS_PEDIDOS.CANCELADO];
  }

  async to(target) {
    return this.ctx._change(target);
  }
}

module.exports = { Reservado };
