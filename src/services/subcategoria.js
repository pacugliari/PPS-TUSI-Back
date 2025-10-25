const HttpError = require("../utils/http-error");
const subcategoriaRepository = require("../repositories/subcategoria");
const categoriaRepository = require("../repositories/categoria");

const getAllService = async (req) => {
  try {
    const { rows } = await subcategoriaRepository.findAll();
    return rows;
  } catch (err) {
    throw new HttpError(500, "No se pudieron obtener las subcategorías");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const subcategoria = await subcategoriaRepository.findById(id);
  if (!subcategoria || subcategoria.activo === false) {
    throw new HttpError(404, "Subcategoría no encontrada");
  }
  return { data: subcategoria };
};

const createService = async (req) => {
  const { idCategoria, nombre, descripcion } = req.body;

  if (!idCategoria || !nombre) {
    throw new HttpError(400, "Faltan campos requeridos").setErrors([
      ...(!idCategoria ? [{ idCategoria: "La categoría es requerida" }] : []),
      ...(!nombre ? [{ nombre: "El nombre es requerido" }] : []),
    ]);
  }

  const categoria = await categoriaRepository.findById(idCategoria);
  if (!categoria || categoria.activo === false) {
    throw new HttpError(404, "La categoría asociada no existe o está inactiva");
  }

  const existente = await subcategoriaRepository.findOne({
    idCategoria,
    nombre,
    activo: true,
  });
  if (existente) {
    throw new HttpError(
      400,
      "Ya existe una subcategoría con ese nombre en esta categoría"
    ).setErrors([
      { nombre: "El nombre ya está registrado para esta categoría" },
    ]);
  }

  const subcategoria = await subcategoriaRepository.create({
    idCategoria,
    nombre,
    descripcion,
    activo: true,
  });

  return { data: subcategoria };
};

const updateService = async (req) => {
  const { id } = req.params;
  const { idCategoria, nombre, descripcion, activo } = req.body;

  const actual = await subcategoriaRepository.findById(id);
  if (!actual || actual.activo === false) {
    throw new HttpError(404, "Subcategoría no encontrada");
  }

  if (
    idCategoria === undefined &&
    nombre === undefined &&
    descripcion === undefined &&
    activo === undefined
  ) {
    throw new HttpError(400, "No hay campos para actualizar").setErrors([
      { body: "Debe proporcionar al menos un campo para actualizar" },
    ]);
  }

  if (idCategoria !== undefined && idCategoria !== actual.idCategoria) {
    const categoria = await categoriaRepository.findById(idCategoria);
    if (!categoria || categoria.activo === false) {
      throw new HttpError(404, "La nueva categoría no existe o está inactiva");
    }
  }

  if (nombre !== undefined && nombre !== actual.nombre) {
    const existente = await subcategoriaRepository.findOne({
      idCategoria: idCategoria ?? actual.idCategoria,
      nombre,
      activo: true,
    });
    if (existente) {
      throw new HttpError(
        400,
        "Ya existe una subcategoría con ese nombre en esta categoría"
      ).setErrors([
        { nombre: "El nombre ya está registrado para esta categoría" },
      ]);
    }
  }

  const updated = await subcategoriaRepository.update(id, {
    ...(idCategoria !== undefined && { idCategoria }),
    ...(nombre !== undefined && { nombre }),
    ...(descripcion !== undefined && { descripcion }),
    ...(activo !== undefined && { activo }),
  });

  return { data: updated };
};

const deleteService = async (req) => {
  const { id } = req.params;
  const subcategoria = await subcategoriaRepository.findById(id);
  if (!subcategoria || subcategoria.activo === false) {
    throw new HttpError(404, "Subcategoría no encontrada");
  }

  const updated = await subcategoriaRepository.update(id, { activo: false });
  return { data: updated };
};

const getOptionsService = async () => {
  try {
    const { rows } = await categoriaRepository.findAll();
    return { categorias: rows };
  } catch (err) {
    throw new HttpError(
      500,
      "No se pudieron obtener las opciones de categorías"
    );
  }
};

module.exports = {
  getAllService,
  getByIdService,
  createService,
  updateService,
  deleteService,
  getOptionsService,
};
