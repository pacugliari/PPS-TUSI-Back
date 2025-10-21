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

  if (!banco || banco.activo === false) {
    throw new HttpError(404, "Banco no encontrado");
  }
  return { data: banco };
};

const createService = async (req) => {
  const { nombre } = req.body;

  if (!nombre) {
    throw new HttpError(400, "El nombre es requerido").setErrors([
      { nombre: "El nombre del banco es requerido" },
    ]);
  }

  const bancoExistente = await bancoRepository.findOne({ nombre });
  if (bancoExistente) {
    throw new HttpError(400, "Ya existe un banco con ese nombre").setErrors([
      { nombre: "El nombre del banco ya está registrado" },
    ]);
  }

  const banco = await bancoRepository.create({ nombre, activo: true });
  return { data: banco };
};

const updateService = async (req) => {
  const { id } = req.params;
  const { nombre, activo } = req.body;

  const banco = await bancoRepository.findById(id);
  if (!banco || banco.activo === false) {
    throw new HttpError(404, "Banco no encontrado");
  }

  if (!nombre && activo === undefined) {
    throw new HttpError(400, "No hay campos para actualizar").setErrors([
      { body: "Debe proporcionar al menos un campo para actualizar" },
    ]);
  }

  if (nombre && nombre !== banco.nombre) {
    const bancoExistente = await bancoRepository.findOne({ nombre });
    if (bancoExistente) {
      throw new HttpError(400, "Ya existe un banco con ese nombre").setErrors([
        { nombre: "El nombre del banco ya está registrado" },
      ]);
    }
  }

  const bancoActualizado = await bancoRepository.update(id, {
    ...(nombre && { nombre }),
    ...(activo !== undefined && { activo }),
  });

  return { data: bancoActualizado };
};

const deleteService = async (req) => {
  const { id } = req.params;
  const banco = await bancoRepository.findById(id);
  if (!banco || banco.activo === false) {
    throw new HttpError(404, "Banco no encontrado");
  }

  const bancoActualizado = await bancoRepository.update(id, { activo: false });
  return { data: bancoActualizado };
};

module.exports = {
  getAllService,
  getByIdService,
  createService,
  updateService,
  deleteService,
};
