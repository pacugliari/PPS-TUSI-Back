const { PedidoState } = require("../state");
const { ESTADOS_PEDIDOS } = require("../../../constants/pedidos");
class Pendiente extends PedidoState {
  name() {
    return ESTADOS_PEDIDOS.PENDIENTE;
  }
  allowed() {
    return [ESTADOS_PEDIDOS.RESERVADO, ESTADOS_PEDIDOS.PAGADO];
  }

  async to(target) {
    return this.ctx._change(target);
  }
}

module.exports = { Pendiente };
