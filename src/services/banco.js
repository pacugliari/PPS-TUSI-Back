const HttpError = require("../utils/http-error");
const bancoRepository = require("../repositories/banco");

const getAllService = async (req) => {
  try {
    const { rows } = await bancoRepository.findAll();
    return rows;
  } catch (err) {
    throw new HttpError(500, "No se pudieron obtener los bancos");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const banco = await bancoRepository.findById(id);
  if (!banco) throw new HttpError(404, "Banco no encontrado");
  return { data: banco };
};

module.exports = {
  getAllService,
  getByIdService,
};
