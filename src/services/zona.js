const HttpError = require("../utils/http-error");
const zonaRepository = require("../repositories/zona");

const getAllService = async (req) => {
  try {
    const { rows } = await zonaRepository.findAll();
    return rows;
  } catch (err) {
    throw new HttpError(500, "No se pudieron obtener las zonas");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const zona = await zonaRepository.findById(id);
  if (!zona) throw new HttpError(404, "Zona no encontrada");
  return { data: zona };
};

const createService = async (req) => {
  const { nombre } = req.body;
  if (!nombre) {
    throw new HttpError(400, "El nombre es requerido");
  }
  const zona = await zonaRepository.create({ nombre });
  return zona;
};

const updateService = async (req) => {
  const { id } = req.params;
  const { nombre } = req.body;
  if (!nombre) {
    throw new HttpError(400, "El nombre es requerido para actualizar");
  }
  const zonaExistente = await zonaRepository.findById(id);
  if (!zonaExistente) throw new HttpError(404, "Zona no encontrada");
  const zona = await zonaRepository.update(id, { nombre });
  return zona;
};

module.exports = {
  getAllService,
  getByIdService,
  createService,
  updateService,
};
