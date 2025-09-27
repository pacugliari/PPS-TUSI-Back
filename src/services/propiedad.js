const HttpError = require("../utils/http-error");
const propiedadRepository = require("../repositories/propiedad");

const getAllService = async (req) => {
  try {
    const { rows } = await propiedadRepository.findAll();
    return rows;
  } catch (err) {
    throw new HttpError(500, "No se pudieron obtener las propiedades");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const propiedad = await propiedadRepository.findById(id);
  if (!propiedad) throw new HttpError(404, "Propiedad no encontrada");
  return { data: propiedad };
};

module.exports = {
  getAllService,
  getByIdService,
};
