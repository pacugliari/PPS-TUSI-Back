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

const createService = async (req) => {
  const { nombre } = req.body;

  if (!nombre) {
    throw new HttpError(400, "El nombre es requerido").setErrors([
      { nombre: "El nombre del banco es requerido" }
    ]);
  }

  // Verificar si ya existe un banco con el mismo nombre
  const bancoExistente = await bancoRepository.findOne({ nombre });
  if (bancoExistente) {
    throw new HttpError(400, "Ya existe un banco con ese nombre").setErrors([
      { nombre: "El nombre del banco ya está registrado" }
    ]);
  }

  const banco = await bancoRepository.create({ nombre });
  return { data: banco };
};

const updateService = async (req) => {
  const { id } = req.params;
  const { nombre } = req.body;

  if (!nombre) {
    throw new HttpError(400, "El nombre es requerido").setErrors([
      { nombre: "El nombre del banco es requerido" }
    ]);
  }

  // Verificar si existe el banco
  const banco = await bancoRepository.findById(id);
  if (!banco) {
    throw new HttpError(404, "Banco no encontrado");
  }

  // Verificar si ya existe otro banco con el mismo nombre
  if (nombre !== banco.nombre) {
    const bancoExistente = await bancoRepository.findOne({ nombre });
    if (bancoExistente) {
      throw new HttpError(400, "Ya existe un banco con ese nombre").setErrors([
        { nombre: "El nombre del banco ya está registrado" }
      ]);
    }
  }

  const bancoActualizado = await bancoRepository.update(id, { nombre });
  return { data: bancoActualizado };
};

const deleteService = async (req) => {
  const { id } = req.params;
  const banco = await bancoRepository.findById(id);
  if (!banco) throw new HttpError(404, "Banco no encontrado");
  await bancoRepository.remove(id);
  return true;
};

module.exports = {
  getAllService,
  getByIdService,
  createService,
  updateService,
  deleteService,
};
