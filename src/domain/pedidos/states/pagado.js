const { PedidoState } = require("../state");
const { ESTADOS_PEDIDOS } = require("../../../constants/pedidos");

class Pagado extends PedidoState {
  name() {
    return ESTADOS_PEDIDOS.PAGADO;
  }
  allowed() {
    return [ESTADOS_PEDIDOS.ENVIADO, ESTADOS_PEDIDOS.CANCELADO];
  }

  async to(target) {
    return this.ctx._change(target);
  }
}

module.exports = { Pagado };
