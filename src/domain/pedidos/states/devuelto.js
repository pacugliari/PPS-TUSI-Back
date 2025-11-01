const { PedidoState } = require("../state");

class Devuelto extends PedidoState {
  name() {
    return "devuelto";
  }
  allowed() {
    return [];
  }

  async to() {
    return this.ctx._reject("Pedido devuelto — sin transiciones posibles");
  }
}

module.exports = { Devuelto };
