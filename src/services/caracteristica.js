const HttpError = require("../utils/http-error");
const caracteristicaRepository = require("../repositories/caracteristica");

const getAllService = async () => {
  try {
    const { rows } = await caracteristicaRepository.findAll();
    return rows;
  } catch (err) {
    throw new HttpError(500, "No se pudieron obtener las características");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const caracteristica = await caracteristicaRepository.findById(id);
  if (!caracteristica || caracteristica.activo === false) {
    throw new HttpError(404, "Característica no encontrada");
  }
  return { data: caracteristica };
};

const createService = async (req) => {
  const { descripcion } = req.body;

  if (!descripcion) {
    throw new HttpError(400, "La descripción es requerida").setErrors([
      { descripcion: "La descripción es obligatoria" },
    ]);
  }

  const existente = await caracteristicaRepository.findOne({
    descripcion,
    activo: true,
  });
  if (existente) {
    throw new HttpError(
      400,
      "Ya existe una característica con esa descripción"
    ).setErrors([{ descripcion: "La descripción ya está registrada" }]);
  }

  const caracteristica = await caracteristicaRepository.create({
    descripcion,
    activo: true,
  });
  return { data: caracteristica };
};

const updateService = async (req) => {
  const { id } = req.params;
  const { descripcion, activo } = req.body;

  const actual = await caracteristicaRepository.findById(id);
  if (!actual || actual.activo === false) {
    throw new HttpError(404, "Característica no encontrada");
  }

  if (descripcion === undefined && activo === undefined) {
    throw new HttpError(400, "No hay campos para actualizar").setErrors([
      { body: "Debe proporcionar al menos un campo para actualizar" },
    ]);
  }

  if (descripcion !== undefined && descripcion !== actual.descripcion) {
    const existente = await caracteristicaRepository.findOne({
      descripcion,
      activo: true,
    });
    if (existente) {
      throw new HttpError(
        400,
        "Ya existe una característica con esa descripción"
      ).setErrors([{ descripcion: "La descripción ya está registrada" }]);
    }
  }

  const updated = await caracteristicaRepository.update(id, {
    ...(descripcion !== undefined && { descripcion }),
    ...(activo !== undefined && { activo }),
  });

  return { data: updated };
};

const deleteService = async (req) => {
  const { id } = req.params;
  const caracteristica = await caracteristicaRepository.findById(id);
  if (!caracteristica || caracteristica.activo === false) {
    throw new HttpError(404, "Característica no encontrada");
  }
  const updated = await caracteristicaRepository.update(id, { activo: false });
  return { data: updated };
};

module.exports = {
  getAllService,
  getByIdService,
  createService,
  updateService,
  deleteService,
};
