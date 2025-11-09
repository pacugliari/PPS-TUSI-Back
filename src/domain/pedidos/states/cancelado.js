const { PedidoState } = require("../state");
const { ESTADOS_PEDIDOS } = require("../../../constants/pedidos");
const { DetallePedido, Stock } = require("../../../models");

class Cancelado extends PedidoState {
  name() {
    return ESTADOS_PEDIDOS.CANCELADO;
  }
  allowed() {
    return [];
  }

  async onEnter(from) {
    const restaurar = [
      ESTADOS_PEDIDOS.RESERVADO,
      ESTADOS_PEDIDOS.PAGADO,
    ].includes(from);
    if (!restaurar) return;

    const tx = this.ctx.tx;
    const idPedido = this.ctx.pedido.idPedido;

    const detalles = await DetallePedido.findAll({
      where: { idPedido },
      transaction: tx,
      lock: tx?.LOCK?.UPDATE,
    });

    for (const item of detalles) {
      const qty = Number(item.cantidad || 0);
      if (qty <= 0) continue;
      const stockRow = await Stock.findOne({
        where: { idProducto: item.idProducto },
        transaction: tx,
        lock: tx?.LOCK?.UPDATE,
      });
      if (!stockRow) continue;

      let stockActual = Number(stockRow.stockActual || 0) + qty;
      let reservado = Number(stockRow.reservado || 0);
      let comprometido = Number(stockRow.comprometido || 0);

      if (from === ESTADOS_PEDIDOS.RESERVADO) {
        reservado = Math.max(0, reservado - qty);
      } else if (from === ESTADOS_PEDIDOS.PAGADO) {
        comprometido = Math.max(0, comprometido - qty);
      }

      const disponibilidad = stockActual - reservado - comprometido;

      await stockRow.update(
        { stockActual, reservado, comprometido, disponibilidad },
        { transaction: tx }
      );
    }
  }

  async to() {
    return this.ctx._reject("Pedido cancelado — sin transiciones posibles");
  }
}

module.exports = { Cancelado };
