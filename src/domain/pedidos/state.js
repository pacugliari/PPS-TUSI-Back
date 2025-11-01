// src/domain/pedidos/state.js
class PedidoState {
  constructor(ctx) {
    this.ctx = ctx;
  }

  name() {
    throw new Error('Debe implementar name()');
  }

  allowed() {
    return [];
  }

  async onEnter(from) {}

  async to(target) {
    throw new Error(`Transición no soportada desde ${this.name()} a ${target}`);
  }
}

module.exports = { PedidoState };
