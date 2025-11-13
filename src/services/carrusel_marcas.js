const HttpError = require("../utils/http-error");
const carruselMarcasRepository = require("../repositories/carrusel_marcas");

const getAllService = async () => {
  try {
    const { rows } = await carruselMarcasRepository.findAll();
    return rows;
  } catch (err) {
    throw new HttpError(500, "No se pudo obtener el carrusel de marcas");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const marca = await carruselMarcasRepository.findById(id);

  if (!marca || marca.activo === false) {
    throw new HttpError(404, "Marca del carrusel no encontrada");
  }
  return { data: marca };
};

const createService = async (req) => {
  const { nombre, logoUrl, orden } = req.body;

  if (!nombre) {
    throw new HttpError(400, "El nombre es requerido").setErrors([
      { nombre: "Debe proporcionar el nombre de la marca" },
    ]);
  }

  if (!logoUrl) {
    throw new HttpError(400, "El logo es requerido").setErrors([
      { logoUrl: "Debe proporcionar la URL del logo" },
    ]);
  }

  // Nombre duplicado
  const existente = await carruselMarcasRepository.findOne({ nombre });
  if (existente) {
    throw new HttpError(400, "La marca ya está en el carrusel").setErrors([
      { nombre: "Ya existe una marca con ese nombre" },
    ]);
  }

  // Orden duplicado
  if (orden !== undefined) {
    const existeOrden = await carruselMarcasRepository.findOne({ orden });
    if (existeOrden) {
      throw new HttpError(400, "Orden ya utilizado").setErrors([
        { orden: "Ya existe una marca en ese orden del carrusel" },
      ]);
    }
  }

  const nueva = await carruselMarcasRepository.create({
    nombre,
    logoUrl,
    orden,
    activo: true,
  });

  return { data: nueva };
};

const updateService = async (req) => {
  const { id } = req.params;
  const { nombre, logoUrl, orden, activo } = req.body;

  const marca = await carruselMarcasRepository.findById(id);
  if (!marca || marca.activo === false) {
    throw new HttpError(404, "Marca no encontrada");
  }

  // Nombre duplicado
  if (nombre && nombre !== marca.nombre) {
    const existente = await carruselMarcasRepository.findOne({ nombre });
    if (existente) {
      throw new HttpError(400, "La marca ya existe").setErrors([
        { nombre: "El nombre ya está registrado en el carrusel" },
      ]);
    }
  }

  // Orden duplicado
  if (orden !== undefined && orden !== marca.orden) {
    const existeOrden = await carruselMarcasRepository.findOne({ orden });
    if (existeOrden) {
      throw new HttpError(400, "Orden ya utilizado").setErrors([
        { orden: "Ya hay una marca ubicada en ese orden" },
      ]);
    }
  }

  const actualizada = await carruselMarcasRepository.update(id, {
    ...(nombre && { nombre }),
    ...(logoUrl && { logoUrl }),
    ...(orden !== undefined && { orden }),
    ...(activo !== undefined && { activo }),
  });

  return { data: actualizada };
};

const deleteService = async (req) => {
  const { id } = req.params;
  const marca = await carruselMarcasRepository.findById(id);

  if (!marca || marca.activo === false) {
    throw new HttpError(404, "Marca no encontrada");
  }

  const eliminada = await carruselMarcasRepository.update(id, {
    activo: false,
  });
  return { data: eliminada };
};

module.exports = {
  getAllService,
  getByIdService,
  createService,
  updateService,
  deleteService,
};
