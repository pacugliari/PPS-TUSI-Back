const { PedidoState } = require("../state");

class Reservado extends PedidoState {
  name() {
    return "reservado";
  }
  allowed() {
    return ["entregado", "cancelado"];
  }

  async to(target) {
    return this.ctx._change(target);
  }
}

module.exports = { Reservado };
