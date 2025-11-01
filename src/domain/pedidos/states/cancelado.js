const { PedidoState } = require("../state");

class Cancelado extends PedidoState {
  name() {
    return "cancelado";
  }
  allowed() {
    return [];
  }

  async to() {
    return this.ctx._reject("Pedido cancelado — sin transiciones posibles");
  }
}

module.exports = { Cancelado };
