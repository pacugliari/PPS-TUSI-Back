const { PedidoState } = require("../state");
const { ESTADOS_PEDIDOS } = require("../../../constants/pedidos");
class Entregado extends PedidoState {
  name() {
    return ESTADOS_PEDIDOS.ENTREGADO;
  }
  allowed() {
    return [ESTADOS_PEDIDOS.DEVUELTO];
  }

  async to(target) {
    return this.ctx._change(target);
  }
}

module.exports = { Entregado };
