const { PedidoState } = require("../state");
const { ESTADOS_PEDIDOS } = require("../../../constants/pedidos");
class Enviado extends PedidoState {
  name() {
    return ESTADOS_PEDIDOS.ENVIADO;
  }
  allowed() {
    return [ESTADOS_PEDIDOS.ENTREGADO];
  }

  async to(target) {
    return this.ctx._change(target);
  }
}

module.exports = { Enviado };
