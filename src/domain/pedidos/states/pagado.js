const { PedidoState } = require("../state");

class Pagado extends PedidoState {
  name() {
    return "pagado";
  }
  allowed() {
    return ["enviado", "cancelado"];
  }

  async to(target) {
    return this.ctx._change(target);
  }
}

module.exports = { Pagado };
