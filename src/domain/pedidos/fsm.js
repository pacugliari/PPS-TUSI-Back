const HttpError = require("../../utils/http-error");
const { ESTADOS_PEDIDOS } = require("../../constants/pedidos");

const { Pendiente } = require("./states/pendiente");
const { Reservado } = require("./states/reservado");
const { Pagado } = require("./states/pagado");
const { Enviado } = require("./states/enviado");
const { Entregado } = require("./states/entregado");
const { Cancelado } = require("./states/cancelado");
const { Devuelto } = require("./states/devuelto");

const REGISTRY = {
  [ESTADOS_PEDIDOS.PENDIENTE]: Pendiente,
  [ESTADOS_PEDIDOS.RESERVADO]: Reservado,
  [ESTADOS_PEDIDOS.PAGADO]: Pagado,
  [ESTADOS_PEDIDOS.ENVIADO]: Enviado,
  [ESTADOS_PEDIDOS.ENTREGADO]: Entregado,
  [ESTADOS_PEDIDOS.CANCELADO]: Cancelado,
  [ESTADOS_PEDIDOS.DEVUELTO]: Devuelto,
};

class OrderFSM {
  constructor(pedido, tx) {
    this.pedido = pedido;
    this.tx = tx;
    this.state = this._make(pedido.estado);
  }

  _make(name) {
    const Ctor = REGISTRY[name];
    if (!Ctor) throw new HttpError(500, `Estado desconocido: ${name}`);
    return new Ctor(this);
  }

  async transition(to) {
    const target = String(to || "")
      .trim()
      .toLowerCase();
    if (!target) throw new HttpError(400, "Estado destino requerido");

    if (!Object.values(ESTADOS_PEDIDOS).includes(target)) {
      throw new HttpError(400, `Estado destino inválido: ${target}`);
    }

    if (!this.state.allowed().includes(target)) {
      throw new HttpError(
        400,
        `Transición no permitida: ${this.state.name()} → ${target}`
      );
    }

    return this.state.to(target);
  }

  async _change(target) {
    const from = this.state.name();
    this.pedido.estado = target;
    await this.pedido.save({ transaction: this.tx });
    this.state = this._make(target);
    await this.state.onEnter(from);
    return this.pedido.get({ plain: true });
  }

  _reject(msg) {
    throw new HttpError(400, msg);
  }
}

module.exports = { OrderFSM };
