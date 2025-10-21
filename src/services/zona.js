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
  if (!zona || zona.activo === false) {
    throw new HttpError(404, "Zona no encontrada");
  }
  return { data: zona };
};

const createService = async (req) => {
  const { nombre, ciudad, provincia, costoEnvio } = req.body;

  if (!nombre) {
    throw new HttpError(400, "El nombre es requerido");
  }

  const zona = await zonaRepository.create({
    nombre,
    ciudad,
    provincia,
    costoEnvio,
    activo: true,
  });

  return { data: zona };
};

const updateService = async (req) => {
  const { id } = req.params;
  const { nombre, ciudad, provincia, costoEnvio } = req.body;

  const zonaExistente = await zonaRepository.findById(id);
  if (!zonaExistente || zonaExistente.activo === false) {
    throw new HttpError(404, "Zona no encontrada");
  }

  if (!nombre && !ciudad && !provincia && costoEnvio === undefined) {
    throw new HttpError(400, "No hay campos para actualizar").setErrors([
      { body: "Debe proporcionar al menos un campo para actualizar" },
    ]);
  }

  const zona = await zonaRepository.update(id, {
    ...(nombre && { nombre }),
    ...(ciudad && { ciudad }),
    ...(provincia && { provincia }),
    ...(costoEnvio !== undefined && { costoEnvio }),
  });

  return { data: zona };
};

const deleteService = async (req) => {
  const { id } = req.params;
  const zona = await zonaRepository.findById(id);

  if (!zona || zona.activo === false) {
    throw new HttpError(404, "Zona no encontrada");
  }

  const updatedZona = await zonaRepository.update(id, { activo: false });
  return { data: updatedZona };
};

module.exports = {
  getAllService,
  getByIdService,
  createService,
  updateService,
  deleteService,
};
