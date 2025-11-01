const { PedidoState } = require("../state");

class Entregado extends PedidoState {
  name() {
    return "entregado";
  }
  allowed() {
    return ["devuelto"];
  }

  async to(target) {
    return this.ctx._change(target);
  }
}

module.exports = { Entregado };
