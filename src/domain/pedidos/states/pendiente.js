const { PedidoState } = require("../state");

class Pendiente extends PedidoState {
  name() {
    return "pendiente";
  }
  allowed() {
    return ["reservado", "pagado"];
  }

  async to(target) {
    return this.ctx._change(target);
  }
}

module.exports = { Pendiente };
