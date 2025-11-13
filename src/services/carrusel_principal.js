const HttpError = require("../utils/http-error");
const carruselPrincipalRepository = require("../repositories/carrusel_principal");

const getAllService = async () => {
  try {
    const { rows } = await carruselPrincipalRepository.findAll();
    return rows;
  } catch (err) {
    throw new HttpError(500, "No se pudo obtener el carrusel principal");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const slide = await carruselPrincipalRepository.findById(id);

  if (!slide || slide.activo === false) {
    throw new HttpError(404, "Slide no encontrado");
  }

  return { data: slide };
};

const createService = async (req) => {
  const { titulo, descripcion, imagenUrl, link, orden } = req.body;

  if (!imagenUrl) {
    throw new HttpError(400, "La imagen es obligatoria").setErrors([
      { imagenUrl: "Debe proporcionar la URL de la imagen" },
    ]);
  }

  // Validar orden duplicado
  if (orden !== undefined) {
    const existente = await carruselPrincipalRepository.findOne({ orden });
    if (existente) {
      throw new HttpError(400, "El orden ya está utilizado").setErrors([
        { orden: "Ya existe un slide con ese orden" },
      ]);
    }
  }

  const nuevo = await carruselPrincipalRepository.create({
    titulo,
    descripcion,
    imagenUrl,
    link,
    orden,
    activo: true,
  });

  return { data: nuevo };
};

const updateService = async (req) => {
  const { id } = req.params;
  const { titulo, descripcion, imagenUrl, link, orden, activo } = req.body;

  const slide = await carruselPrincipalRepository.findById(id);
  if (!slide || slide.activo === false) {
    throw new HttpError(404, "Slide no encontrado");
  }

  if (!titulo && !descripcion && !imagenUrl && !link && orden === undefined && activo === undefined) {
    throw new HttpError(400, "No hay campos para actualizar").setErrors([
      { body: "Debe proporcionar al menos un campo para actualizar" },
    ]);
  }

  // Validar orden duplicado
  if (orden !== undefined && orden !== slide.orden) {
    const existente = await carruselPrincipalRepository.findOne({ orden });
    if (existente) {
      throw new HttpError(400, "El orden ya está utilizado").setErrors([
        { orden: "Ya existe un slide con ese orden" },
      ]);
    }
  }

  const actualizado = await carruselPrincipalRepository.update(id, {
    ...(titulo && { titulo }),
    ...(descripcion && { descripcion }),
    ...(imagenUrl && { imagenUrl }),
    ...(link && { link }),
    ...(orden !== undefined && { orden }),
    ...(activo !== undefined && { activo }),
  });

  return { data: actualizado };
};

const deleteService = async (req) => {
  const { id } = req.params;
  const slide = await carruselPrincipalRepository.findById(id);

  if (!slide || slide.activo === false) {
    throw new HttpError(404, "Slide no encontrado");
  }

  const eliminado = await carruselPrincipalRepository.update(id, {
    activo: false,
  });

  return { data: eliminado };
};

module.exports = {
  getAllService,
  getByIdService,
  createService,
  updateService,
  deleteService,
};
