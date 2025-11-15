const HttpError = require("../utils/http-error");
const stockRepository = require("../repositories/stock");

const getAllService = async (req) => {
  try {
    const { rows } = await stockRepository.findAll();
    return rows;
  } catch (err) {
    throw new HttpError(500, "No se pudo obtener el stock");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const stock = await stockRepository.findById(id);
  if (!stock) throw new HttpError(404, "Stock no encontrado");
  return { data: stock };
};

// GET /account/stocks/review (solo ADMIN)
const getReviewService = async (req) => {

  const { rows } = await stockRepository.findAllWithProducto();

  const toNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const result = [];
  for (const r of rows || []) {
    const stockActual = toNum(r.stockActual);
    const stockMinimo = toNum(r.stockMinimo);
    const stockMaximo = toNum(r.stockMaximo);
    const reservado = toNum(r.reservado);
    const comprometido = toNum(r.comprometido);
    // Usar disponibilidad que viene de DB; si no está, calcularla
    const disponibilidad = Math.max(
      0,
      Number.isFinite(toNum(r.disponibilidad))
        ? toNum(r.disponibilidad)
        : stockActual - reservado - comprometido
    );

    // Necesita reposición cuando la disponibilidad real está por debajo del mínimo
    if (disponibilidad < stockMinimo) {
      const cantidadAReponer = Math.max(0, stockMaximo - disponibilidad);
      result.push({
        idProducto: r.producto?.idProducto,
        nombre: r.producto?.nombre,
        stockActual,
        stockMinimo,
  stockMaximo,
        reservado,
        comprometido,
        disponibilidad,
        cantidadAReponer,
      });
    }
  }

  return result;
};

module.exports = {
  getAllService,
  getByIdService,
  getReviewService,
};
