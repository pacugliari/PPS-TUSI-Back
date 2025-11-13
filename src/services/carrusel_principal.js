const HttpError = require("../utils/http-error");
const carruselPrincipalRepository = require("../repositories/carrusel_principal");
const mediaService = require("../services/media");

const CAROUSEL_PRINCIPAL_WIDTH = 1900;
const CAROUSEL_PRINCIPAL_HEIGHT = 800;

async function getAllReferencedFotoUrls() {
  const rows = await carruselPrincipalRepository.findAll();
  return rows?.rows?.map((r) => r.imagenUrl).filter(Boolean) ?? [];
}

const getAllService = async () => {
  const { rows } = await carruselPrincipalRepository.findAll();
  return rows;
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
  let { titulo, descripcion, imagenUrl, link, orden } = req.body;
  let fotoErrors = [];

  if (orden !== undefined && orden !== null && orden !== "") {
    orden = Number(orden);
  }

  const existe = orden != null
    ? await carruselPrincipalRepository.findOne({ orden })
    : null;

  if (existe) {
    throw new HttpError(400, "El orden ya está utilizado").setErrors([
      { orden: "Ya existe un slide con ese orden" },
    ]);
  }

  let finalUrl = imagenUrl || null;

  if (!finalUrl && req.file && req.file.buffer) {
    const result = await mediaService.uploadBuffer({
      buffer: req.file.buffer,
      folder: "carousel/principal",
      filename: req.file.originalname,
      format: "jpg",
      eager: [
        {
          width: CAROUSEL_PRINCIPAL_WIDTH,
          height: CAROUSEL_PRINCIPAL_HEIGHT,
          crop: "fill",
          gravity: "auto",
        },
      ],
      returnEager: true,
    });

    if (result?.secure_url) {
      finalUrl = result.secure_url;
    } else {
      fotoErrors.push({ imagen: result?.error || "Error al subir la imagen" });
    }
  }

  if (!finalUrl) {
    throw new HttpError(400, "La imagen es obligatoria").setErrors([
      { imagenUrl: "Debe proporcionar una imagen" },
    ]);
  }

  const nuevo = await carruselPrincipalRepository.create({
    titulo,
    descripcion,
    imagenUrl: finalUrl,
    link,
    orden,
    activo: true,
  });

  try {
    const referenced = await getAllReferencedFotoUrls();
    await mediaService.cleanGlobalOrphansByUrls({
      folder: "carousel/principal",
      referencedUrls: referenced,
    });
  } catch {}

  return { data: nuevo, fotoErrors };
};

const updateService = async (req) => {
  const { id } = req.params;
  let { titulo, descripcion, imagenUrl, link, orden, activo } = req.body;

  const slide = await carruselPrincipalRepository.findById(id);
  if (!slide || slide.activo === false) {
    throw new HttpError(404, "Slide no encontrado");
  }

  if (orden !== undefined && orden !== null && orden !== "") {
    orden = Number(orden);
  }

  const existe = orden != null && orden !== slide.orden
    ? await carruselPrincipalRepository.findOne({ orden })
    : null;

  if (existe) {
    throw new HttpError(400, "El orden ya está utilizado").setErrors([
      { orden: "Ya existe un slide con ese orden" },
    ]);
  }

  let finalUrl = imagenUrl || slide.imagenUrl;
  let fotoErrors = [];

  if (req.file && req.file.buffer) {
    const result = await mediaService.uploadBuffer({
      buffer: req.file.buffer,
      folder: "carousel/principal",
      filename: req.file.originalname,
      format: "jpg",
      eager: [
        {
          width: CAROUSEL_PRINCIPAL_WIDTH,
          height: CAROUSEL_PRINCIPAL_HEIGHT,
          crop: "fill",
          gravity: "auto",
        },
      ],
      returnEager: true,
    });

    if (result?.secure_url) {
      finalUrl = result.secure_url;
    } else {
      fotoErrors.push({ imagen: result?.error || "Error al subir la imagen" });
    }
  }

  const actualizado = await carruselPrincipalRepository.update(id, {
    titulo,
    descripcion,
    imagenUrl: finalUrl,
    link,
    orden,
    activo,
  });

  try {
    const referenced = await getAllReferencedFotoUrls();
    await mediaService.cleanGlobalOrphansByUrls({
      folder: "carousel/principal",
      referencedUrls: referenced,
    });
  } catch {}

  return { data: actualizado, fotoErrors };
};

const deleteService = async (req) => {
  const { id } = req.params;

  const slide = await carruselPrincipalRepository.findById(id);
  if (!slide || slide.activo === false) {
    throw new HttpError(404, "Slide no encontrado");
  }

  const eliminado = await carruselPrincipalRepository.update(id, {
    activo: false,
    imagenUrl: null,
  });

  try {
    const referenced = await getAllReferencedFotoUrls();
    await mediaService.cleanGlobalOrphansByUrls({
      folder: "carousel/principal",
      referencedUrls: referenced,
    });
  } catch {}

  return { data: eliminado };
};

module.exports = {
  getAllService,
  getByIdService,
  createService,
  updateService,
  deleteService,
};
