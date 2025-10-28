const HttpError = require("../utils/http-error");
const productoRepository = require("../repositories/producto");
const categoriaRepository = require("../repositories/categoria");
const subcategoriaRepository = require("../repositories/subcategoria");
const marcaRepository = require("../repositories/marca");
const caracteristicaRepository = require("../repositories/caracteristica");
const { sequelize, Producto, Stock, Propiedad } = require("../models");
const mediaService = require("./media");

/* Helpers */
const toNumber = (v, def = 0) =>
  v == null || v === "" || Number.isNaN(Number(v)) ? def : Number(v);

const clampFotos = (fotos) =>
  Array.isArray(fotos) ? fotos.map(String).slice(0, 3) : [];

const rows = (r) =>
  Array.isArray(r?.rows) ? r.rows : Array.isArray(r) ? r : [];

const computeStock = ({
  stockMinimo = 0,
  stockMaximo = 0,
  stockActual = 0,
  reservado = 0,
  comprometido = 0,
  disponibilidad,
}) => {
  const sMin = toNumber(stockMinimo, 0);
  const sMax = toNumber(stockMaximo, 0);
  const sAct = toNumber(stockActual, 0);
  const resv = toNumber(reservado, 0);
  const comprom = toNumber(comprometido, 0);
  const disp =
    disponibilidad != null
      ? toNumber(disponibilidad, 0)
      : Math.max(sAct - resv - comprom, 0);
  const estado = disp > 0 ? "disponible" : "agotado";
  return {
    stockMinimo: sMin,
    stockMaximo: sMax,
    stockActual: sAct,
    reservado: resv,
    comprometido: comprom,
    disponibilidad: disp,
    estado,
  };
};

const adaptRowToFront = (i = {}) => {
  const s = i.stockDetallado || {};
  const reservado = toNumber(i.reservado ?? s.reservado, 0);
  const comprometido = toNumber(i.comprometido ?? s.comprometido, 0);
  const stockActual = toNumber(i.stockActual ?? s.stockActual, 0);
  const disponibilidad =
    i.disponibilidad != null
      ? toNumber(i.disponibilidad)
      : s.disponibilidad != null
      ? toNumber(s.disponibilidad)
      : Math.max(stockActual - reservado - comprometido, 0);
  const estadoCalc =
    i.estado === "agotado" || s.estado === "agotado"
      ? "agotado"
      : disponibilidad > 0
      ? "disponible"
      : "agotado";

  return {
    idProducto: toNumber(i.idProducto),
    idCategoria: toNumber(i.idCategoria),
    idSubCategoria: toNumber(i.idSubCategoria),
    idMarca: toNumber(i.idMarca),
    nombre: String(i.nombre ?? "").trim(),
    precio: toNumber(i.precio),
    precioAnterior:
      i.precioAnterior != null ? toNumber(i.precioAnterior) : null,
    descripcion: i.descripcion != null ? String(i.descripcion) : null,
    fotos: clampFotos(i.fotos),
    iva: toNumber(i.iva, 21),
    stockMinimo: toNumber(i.stockMinimo ?? s.stockMinimo, 0),
    stockMaximo: toNumber(i.stockMaximo ?? s.stockMaximo, 0),
    stockActual,
    reservado,
    comprometido,
    disponibilidad,
    estado: estadoCalc,
    propiedades: clampProps(i.propiedades),
    categoriaNombre: i.categoriaNombre ?? i.categoria?.nombre ?? undefined,
    subcategoriaNombre:
      i.subcategoriaNombre ?? i.subcategoria?.nombre ?? undefined,
    marcaNombre: i.marcaNombre ?? i.marca?.nombre ?? undefined,
  };
};

/* Normalización de propiedades (para multipart/form-data, JSON, arrays) */
const parsePropsJson = (maybeJson) => {
  if (typeof maybeJson !== "string") return null;
  try {
    const parsed = JSON.parse(maybeJson);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const parsePropsFromFlatKeys = (body) => {
  const regex = /^propiedades\[(\d+)\]\[(idCaracteristica|valor)\]$/;
  const buckets = new Map();
  let found = false;
  Object.keys(body || {}).forEach((k) => {
    const m = k.match(regex);
    if (!m) return;
    found = true;
    const idx = Number(m[1]);
    const field = m[2];
    const bucket = buckets.get(idx) || {
      idCaracteristica: undefined,
      valor: undefined,
    };
    bucket[field] = body[k];
    buckets.set(idx, bucket);
  });
  if (!found) return null;
  return Array.from(buckets.keys())
    .sort((a, b) => a - b)
    .map((i) => buckets.get(i));
};

function normalizePropsFromBody(body) {
  if (typeof body?.propiedades_json === "string") {
    const pj = parsePropsJson(body.propiedades_json);
    if (pj) return pj;
  }
  const asJson = parsePropsJson(body?.propiedades);
  if (asJson) return asJson;
  if (Array.isArray(body?.propiedades)) return body.propiedades;
  const fromFlat = parsePropsFromFlatKeys(body);
  if (fromFlat) return fromFlat;
  if (body?.propiedades && typeof body.propiedades === "object")
    return [body.propiedades];
  return [];
}

const clampProps = (props) =>
  Array.isArray(props)
    ? props
        .slice(0, 5)
        .map((p) => ({
          idCaracteristica: toNumber(p?.idCaracteristica),
          valor: String(p?.valor ?? "").trim(),
        }))
        .filter((p) => p.idCaracteristica > 0 && p.valor.length > 0)
    : [];

function hasMultipartProps(body) {
  if (!body) return false;
  return Object.keys(body).some((k) =>
    /^propiedades\[\d+\]\[(idCaracteristica|valor)\]$/.test(k)
  );
}

async function getAllReferencedFotoUrls() {
  const rows = await Producto.findAll({ attributes: ["fotos"], raw: true });
  const urls = [];
  rows.forEach((r) => {
    if (Array.isArray(r.fotos)) urls.push(...r.fotos);
  });
  return urls;
}

/* Services */
const getAllService = async () => {
  try {
    const { rows: list } = await productoRepository.findAll();
    const activos = (Array.isArray(list) ? list : []).filter(
      (r) => r.activo !== false
    );
    return activos.map(adaptRowToFront);
  } catch {
    throw new HttpError(500, "No se pudieron obtener los productos");
  }
};

const getOptionsService = async () => {
  try {
    const [categorias, subcategorias, marcas, caracteristicas] =
      await Promise.all([
        categoriaRepository.findAll(),
        subcategoriaRepository.findAll(),
        marcaRepository.findAll(),
        caracteristicaRepository.findAll(),
      ]);

    return {
      categorias: rows(categorias)
        .filter((c) => c.activo !== false)
        .map((c) => ({
          idCategoria: toNumber(c.idCategoria),
          nombre: String(c.nombre ?? ""),
        })),
      subcategorias: rows(subcategorias)
        .filter((s) => s.activo !== false)
        .map((s) => ({
          idSubCategoria: toNumber(s.idSubCategoria),
          idCategoria: toNumber(s.idCategoria),
          nombre: String(s.nombre ?? ""),
        })),
      marcas: rows(marcas)
        .filter((m) => m.activo !== false)
        .map((m) => ({
          idMarca: toNumber(m.idMarca),
          nombre: String(m.nombre ?? ""),
        })),
      caracteristicas: rows(caracteristicas)
        .filter((c) => c.activo !== false)
        .map((c) => ({
          idCaracteristica: toNumber(c.idCaracteristica),
          descripcion: String(c.descripcion ?? ""),
        })),
    };
  } catch {
    throw new HttpError(
      500,
      "No se pudieron obtener las opciones de productos"
    );
  }
};

const createService = async (req) => {
  const {
    idCategoria,
    idSubCategoria,
    idMarca,
    nombre,
    precio,
    descripcion,
    fotos,
    iva,
    stockMinimo,
    stockMaximo,
    stockActual,
    reservado,
    comprometido,
    disponibilidad,
  } = req.body || {};

  const errors = [];
  ["idCategoria", "idSubCategoria", "idMarca", "nombre", "precio"].forEach(
    (f) => {
      if (req.body[f] == null || req.body[f] === "")
        errors.push({ [f]: `El campo ${f} es requerido` });
    }
  );
  if (toNumber(precio) <= 0)
    errors.push({ precio: "El precio debe ser mayor a cero" });
  const ivaNum = toNumber(iva, 21);
  if (ivaNum < 0 || ivaNum > 27)
    errors.push({ iva: "IVA debe estar entre 0 y 27" });
  if (toNumber(stockMinimo, 0) < 0)
    errors.push({ stockMinimo: "No puede ser negativo" });
  if (toNumber(stockMaximo, 0) < 0)
    errors.push({ stockMaximo: "No puede ser negativo" });
  if (toNumber(stockActual, 0) < 0)
    errors.push({ stockActual: "No puede ser negativo" });
  if (errors.length)
    throw new HttpError(400, "Datos inválidos").setErrors(errors);

  const props = clampProps(normalizePropsFromBody(req.body));

  const created = await sequelize.transaction(async (t) => {
    const initialFotos = Array.isArray(fotos) ? clampFotos(fotos) : [];
    const createdProd = await Producto.create(
      {
        idCategoria: toNumber(idCategoria),
        idSubCategoria: toNumber(idSubCategoria),
        idMarca: toNumber(idMarca),
        nombre: String(nombre).trim(),
        precio: toNumber(precio),
        precioAnterior: null,
        descripcion: descripcion != null ? String(descripcion) : null,
        fotos: initialFotos,
        iva: ivaNum,
        activo: true,
      },
      { transaction: t }
    );

    const stockData = computeStock({
      stockMinimo,
      stockMaximo,
      stockActual,
      reservado,
      comprometido,
      disponibilidad,
    });
    await Stock.create(
      { idProducto: createdProd.idProducto, ...stockData },
      { transaction: t }
    );

    if (props.length) {
      await Propiedad.bulkCreate(
        props.map((p) => ({
          idProducto: createdProd.idProducto,
          idCaracteristica: p.idCaracteristica,
          valor: p.valor,
        })),
        { transaction: t }
      );
    }

    return createdProd;
  });

  let fotoErrors = [];
  const hasUrlFotos = Array.isArray(fotos) && fotos.length > 0;
  const files = Array.isArray(req.files) ? req.files.slice(0, 3) : [];
  if (!hasUrlFotos && files.length) {
    const results = await mediaService.uploadManyBuffers(files, {
      folder: "productos",
      max: 3,
      format: "jpg",
      eager: [{ width: 800, height: 1200, crop: "fill", gravity: "auto" }],
      returnEager: true,
    });
    const okUrls = results.filter((r) => r.ok && r.url).map((r) => r.url);
    fotoErrors = results
      .map((r, idx) =>
        !r.ok ? { [`foto${idx + 1}`]: r.error || "Error al subir" } : null
      )
      .filter(Boolean);
    if (okUrls.length > 0) {
      await Producto.update(
        { fotos: clampFotos(okUrls) },
        { where: { idProducto: created.idProducto } }
      );
    }
  }

  try {
    const referencedUrls = await getAllReferencedFotoUrls();
    await mediaService.cleanGlobalOrphansByUrls({
      folder: "productos",
      referencedUrls,
    });
  } catch (e) {
    console.warn("[CLOUDINARY] Limpieza global tras CREATE falló:", e);
  }

  const rec = await productoRepository.findById(created.idProducto);
  if (!rec || rec.activo === false)
    throw new HttpError(404, "Producto no encontrado");
  const adapted = adaptRowToFront(rec);
  return { ...adapted, fotoErrors };
};

const updateService = async (req) => {
  const { id } = req.params;
  const {
    idCategoria,
    idSubCategoria,
    idMarca,
    nombre,
    precio,
    descripcion,
    fotos,
    iva,
    stockMinimo,
    stockMaximo,
    stockActual,
    reservado,
    comprometido,
    disponibilidad,
    propiedades,
    activo,
  } = req.body || {};

  const existente = await productoRepository.findById(id);
  if (!existente || existente.activo === false)
    throw new HttpError(404, "Producto no encontrado");

  const errors = [];
  if (precio !== undefined && toNumber(precio) <= 0)
    errors.push({ precio: "El precio debe ser mayor a cero" });
  if (iva !== undefined) {
    const ivaNum = toNumber(iva);
    if (ivaNum < 0 || ivaNum > 27)
      errors.push({ iva: "IVA debe estar entre 0 y 27" });
  }
  if (stockMinimo !== undefined && toNumber(stockMinimo) < 0)
    errors.push({ stockMinimo: "No puede ser negativo" });
  if (stockMaximo !== undefined && toNumber(stockMaximo) < 0)
    errors.push({ stockMaximo: "No puede ser negativo" });
  if (stockActual !== undefined && toNumber(stockActual) < 0)
    errors.push({ stockActual: "No puede ser negativo" });
  if (errors.length)
    throw new HttpError(400, "Datos inválidos").setErrors(errors);

  const existingFotos = clampFotos(existente.fotos);
  const hasBodyUrls = Array.isArray(fotos) && fotos.length > 0;
  const files = Array.isArray(req.files) ? req.files.slice(0, 3) : [];
  let finalUrls = existingFotos;
  let fotoErrors = [];

  if (!hasBodyUrls && files.length) {
    const results = await mediaService.uploadManyBuffers(files, {
      folder: "productos",
      max: 3,
      format: "jpg",
      eager: [{ width: 800, height: 1200, crop: "fill", gravity: "auto" }],
      returnEager: true,
    });
    const okUrls = results.filter((r) => r.ok && r.url).map((r) => r.url);
    fotoErrors = results
      .map((r, idx) =>
        !r.ok ? { [`foto${idx + 1}`]: r.error || "Error al subir" } : null
      )
      .filter(Boolean);
    finalUrls = okUrls.length > 0 ? clampFotos(okUrls) : existingFotos;
  } else if (hasBodyUrls) {
    finalUrls = clampFotos(fotos);
  }

  await sequelize.transaction(async (t) => {
    const updateData = {};
    if (idCategoria !== undefined)
      updateData.idCategoria = toNumber(idCategoria);
    if (idSubCategoria !== undefined)
      updateData.idSubCategoria = toNumber(idSubCategoria);
    if (idMarca !== undefined) updateData.idMarca = toNumber(idMarca);
    if (nombre !== undefined) updateData.nombre = String(nombre).trim();
    if (precio !== undefined) {
      updateData.precioAnterior = toNumber(existente.precio);
      updateData.precio = toNumber(precio);
    }
    if (descripcion !== undefined)
      updateData.descripcion = descripcion != null ? String(descripcion) : null;
    if (hasBodyUrls || files.length) updateData.fotos = finalUrls;
    if (iva !== undefined) updateData.iva = toNumber(iva);
    if (activo !== undefined) updateData.activo = !!activo;

    await Producto.update(updateData, {
      where: { idProducto: id },
      transaction: t,
    });

    const anyStockField =
      stockMinimo !== undefined ||
      stockMaximo !== undefined ||
      stockActual !== undefined ||
      reservado !== undefined ||
      comprometido !== undefined ||
      disponibilidad !== undefined;

    if (anyStockField) {
      const curr = await Stock.findOne({
        where: { idProducto: id },
        transaction: t,
      });
      const merged = computeStock({
        stockMinimo: stockMinimo ?? curr?.stockMinimo,
        stockMaximo: stockMaximo ?? curr?.stockMaximo,
        stockActual: stockActual ?? curr?.stockActual,
        reservado: reservado ?? curr?.reservado,
        comprometido: comprometido ?? curr?.comprometido,
        disponibilidad: disponibilidad ?? curr?.disponibilidad,
      });
      if (curr) await curr.update(merged, { transaction: t });
      else
        await Stock.create({ idProducto: id, ...merged }, { transaction: t });
    }

    if (propiedades !== undefined || hasMultipartProps(req.body)) {
      const propsNorm = normalizePropsFromBody(req.body);
      const props = clampProps(propsNorm);
      await Propiedad.destroy({ where: { idProducto: id }, transaction: t });
      if (props.length) {
        await Propiedad.bulkCreate(
          props.map((p) => ({
            idProducto: id,
            idCaracteristica: p.idCaracteristica,
            valor: p.valor,
          })),
          { transaction: t }
        );
      }
    }
  });

  try {
    const referencedUrls = await getAllReferencedFotoUrls();
    await mediaService.cleanGlobalOrphansByUrls({
      folder: "productos",
      referencedUrls,
    });
  } catch (e) {
    console.warn("[CLOUDINARY] Limpieza global tras UPDATE falló:", e);
  }

  const rec = await productoRepository.findById(id);
  if (!rec || rec.activo === false)
    throw new HttpError(404, "Producto no encontrado");
  const adapted = adaptRowToFront(rec);
  return { ...adapted, fotoErrors };
};

const deleteService = async (req) => {
  const { id } = req.params;
  const existing = await productoRepository.findById(id);
  if (!existing || existing.activo === false)
    throw new HttpError(404, "Producto no encontrado");
  await Producto.update(
    { activo: false, fotos: [] },
    { where: { idProducto: id } }
  );
  try {
    const referencedUrls = await getAllReferencedFotoUrls();
    await mediaService.cleanGlobalOrphansByUrls({
      folder: "productos",
      referencedUrls,
    });
  } catch (e) {
    console.warn("[CLOUDINARY] Limpieza global tras DELETE falló:", e);
  }
  return true;
};

module.exports = {
  getAllService,
  getOptionsService,
  createService,
  updateService,
  deleteService,
};
