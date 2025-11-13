// src/services/carrusel_marcas.js
const HttpError = require("../utils/http-error");
const carruselMarcasRepository = require("../repositories/carrusel_marcas");
const mediaService = require("../services/media");

const CAROUSEL_MARCAS_WIDTH = 1024;
const CAROUSEL_MARCAS_HEIGHT = 1024;

async function getAllReferencedLogoUrls() {
  const rows = await carruselMarcasRepository.findAll();
  return rows?.rows?.map((m) => m.logoUrl).filter(Boolean) ?? [];
}

const getAllService = async () => {
  const { rows } = await carruselMarcasRepository.findAll();
  return rows;
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const marca = await carruselMarcasRepository.findById(id);

  if (!marca || marca.activo === false) {
    throw new HttpError(404, "Marca no encontrada");
  }

  return { data: marca };
};

const createService = async (req) => {
  let { nombre, logoUrl, orden } = req.body;

  if (!nombre) {
    throw new HttpError(400, "El nombre es requerido").setErrors([
      { nombre: "Debe proporcionar el nombre" },
    ]);
  }

  const exNombre = await carruselMarcasRepository.findOne({ nombre });
  if (exNombre) {
    throw new HttpError(400, "La marca ya existe").setErrors([
      { nombre: "Ya hay una marca con ese nombre" },
    ]);
  }

  if (orden !== undefined && orden !== null && orden !== "") {
    orden = Number(orden);
    const exOrden = await carruselMarcasRepository.findOne({ orden });
    if (exOrden) {
      throw new HttpError(400, "Orden ya utilizado").setErrors([
        { orden: "Ya existe una marca en ese orden" },
      ]);
    }
  }

  let finalUrl = logoUrl || null;
  let fotoErrors = [];

  if (!finalUrl && req.file && req.file.buffer) {
    const result = await mediaService.uploadBuffer({
      buffer: req.file.buffer,
      folder: "carousel/marcas",
      filename: req.file.originalname,
      format: "png",
      eager: [
        {
          width: CAROUSEL_MARCAS_WIDTH,
          height: CAROUSEL_MARCAS_HEIGHT,
          crop: "fill",
          gravity: "auto",
        },
      ],
      returnEager: true,
    });

    if (result?.secure_url) {
      finalUrl = result.secure_url;
    } else {
      fotoErrors.push({ logo: result?.error || "Error al subir el logo" });
    }
  }

  if (!finalUrl) {
    throw new HttpError(400, "El logo es obligatorio").setErrors([
      { logoUrl: "Debe proporcionar una imagen" },
    ]);
  }

  const nueva = await carruselMarcasRepository.create({
    nombre,
    logoUrl: finalUrl,
    orden,
    activo: true,
  });

  try {
    const referenced = await getAllReferencedLogoUrls();
    await mediaService.cleanGlobalOrphansByUrls({
      folder: "carousel/marcas",
      referencedUrls: referenced,
    });
  } catch {}

  return { data: nueva, fotoErrors };
};

const updateService = async (req) => {
  const { id } = req.params;
  let { nombre, logoUrl, orden, activo } = req.body;

  const marca = await carruselMarcasRepository.findById(id);
  if (!marca || marca.activo === false) {
    throw new HttpError(404, "Marca no encontrada");
  }

  if (nombre && nombre !== marca.nombre) {
    const exNombre = await carruselMarcasRepository.findOne({ nombre });
    if (exNombre) {
      throw new HttpError(400, "La marca ya existe").setErrors([
        { nombre: "Ya hay una marca con ese nombre" },
      ]);
    }
  }

  if (orden !== undefined && orden !== null && orden !== "") {
    orden = Number(orden);

    if (orden !== marca.orden) {
      const exOrden = await carruselMarcasRepository.findOne({ orden });

      if (exOrden && exOrden.idCarruselMarcas !== marca.idCarruselMarcas) {
        throw new HttpError(400, "Orden ya utilizado").setErrors([
          { orden: "Ese orden ya está ocupado" },
        ]);
      }
    }
  }

  let finalUrl = logoUrl || marca.logoUrl;
  let fotoErrors = [];

  if (req.file && req.file.buffer) {
    const result = await mediaService.uploadBuffer({
      buffer: req.file.buffer,
      folder: "carousel/marcas",
      filename: req.file.originalname,
      format: "png",
      eager: [
        {
          width: CAROUSEL_MARCAS_WIDTH,
          height: CAROUSEL_MARCAS_HEIGHT,
          crop: "fill",
          gravity: "auto",
        },
      ],
      returnEager: true,
    });

    if (result?.secure_url) {
      finalUrl = result.secure_url;
    } else {
      fotoErrors.push({ logo: result?.error || "Error al subir el logo" });
    }
  }

  const actualizada = await carruselMarcasRepository.update(id, {
    ...(nombre && { nombre }),
    logoUrl: finalUrl,
    ...(orden !== undefined && { orden }),
    ...(activo !== undefined && { activo }),
  });

  try {
    const referenced = await getAllReferencedLogoUrls();
    await mediaService.cleanGlobalOrphansByUrls({
      folder: "carousel/marcas",
      referencedUrls: referenced,
    });
  } catch {}

  return { data: actualizada, fotoErrors };
};

const deleteService = async (req) => {
  const { id } = req.params;

  const marca = await carruselMarcasRepository.findById(id);
  if (!marca || marca.activo === false) {
    throw new HttpError(404, "Marca no encontrada");
  }

  const eliminada = await carruselMarcasRepository.update(id, {
    activo: false,
    logoUrl: null,
  });

  try {
    const referenced = await getAllReferencedLogoUrls();
    await mediaService.cleanGlobalOrphansByUrls({
      folder: "carousel/marcas",
      referencedUrls: referenced,
    });
  } catch {}

  return { data: eliminada };
};

module.exports = {
  getAllService,
  getByIdService,
  createService,
  updateService,
  deleteService,
};
