const { PedidoState } = require("../state");

class Enviado extends PedidoState {
  name() {
    return "enviado";
  }
  allowed() {
    return ["entregado"];
  }

  async to(target) {
    return this.ctx._change(target);
  }
}

module.exports = { Enviado };
