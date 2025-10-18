const HttpError = require("../utils/http-error");
const tarjetaRepository = require("../repositories/tarjeta");

const getAllService = async (req) => {
  try {
    const { rows } = await tarjetaRepository.findAll();
    return rows.filter(t => t.activo);
  } catch (err) {
    throw new HttpError(500, "No se pudieron obtener las tarjetas");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const tarjeta = await tarjetaRepository.findById(id);
  if (!tarjeta || !tarjeta.activo) throw new HttpError(404, "Tarjeta no encontrada");
  return { data: tarjeta };
};

const getByUserService = async (req) => {
  const idUsuario = req.user.id;
  if (!idUsuario) throw new HttpError(401, "Usuario no autenticado");

  const tarjetas = await tarjetaRepository.findByIdUser(idUsuario);

  const data = tarjetas
    .filter((d) => d.activo)
    .map((t) => {
      const numero = t.numero || "";
      const last4 = numero.slice(-4);
      const maskedNumber = `**** **** **** ${last4}`;
      return {
        idTarjeta: t.idTarjeta,
        tipo: t.tipo,
        last4,
        banco: t.banco,
        maskedNumber,
        createdAt: t.createdAt ? t.createdAt.toISOString() : null,
      };
    });

  return { data };
};

const createService = async (req) => {
  const { idBanco, tipo, codigo, numero } = req.body;
  const idUsuario = req.user.id;

  if (!idBanco || !idUsuario || !tipo || !codigo || !numero) {
    throw new HttpError(400, "Faltan campos requeridos").setErrors([
      ...(!idBanco ? [{ idBanco: "El banco es requerido" }] : []),
      ...(!idUsuario ? [{ idUsuario: "El usuario es requerido" }] : []),
      ...(!tipo ? [{ tipo: "El tipo de tarjeta es requerido" }] : []),
      ...(!codigo ? [{ codigo: "El código de seguridad es requerido" }] : []),
      ...(!numero ? [{ numero: "El número de tarjeta es requerido" }] : []),
    ]);
  }

  if (!["VISA", "MASTERCARD"].includes(tipo)) {
    throw new HttpError(400, "Tipo de tarjeta inválido").setErrors([
      { tipo: "El tipo de tarjeta debe ser VISA o MASTERCARD" },
    ]);
  }

  if (!/^\d{3,6}$/.test(codigo)) {
    throw new HttpError(400, "Código de seguridad inválido").setErrors([
      { codigo: "El código debe tener entre 3 y 6 dígitos" },
    ]);
  }

  const numeroLimpio = String(numero).replace(/\s/g, "");
  if (!/^\d{16}$/.test(numeroLimpio)) {
    throw new HttpError(400, "Número de tarjeta inválido").setErrors([
      { numero: "El número debe contener 16 dígitos" },
    ]);
  }

  const existente = await tarjetaRepository.findOne({ numero: numeroLimpio, idUsuario });
  if (existente && existente.activo) {
    throw new HttpError(400, "La tarjeta ya existe").setErrors([
      { numero: "Ya existe una tarjeta registrada con este número" },
    ]);
  }

  const tarjeta = await tarjetaRepository.create({
    idBanco,
    idUsuario,
    tipo,
    codigo,
    numero: numeroLimpio,
    activo: true,
  });
  return { data: tarjeta };
};

const updateService = async (req) => {
  const { id } = req.params;
  const { codigo } = req.body;

  const tarjeta = await tarjetaRepository.findById(id);
  if (!tarjeta || !tarjeta.activo) throw new HttpError(404, "Tarjeta no encontrada");

  if (tarjeta.idUsuario !== req.user.id) {
    throw new HttpError(403, "No tienes permiso para modificar esta tarjeta");
  }

  if (!codigo) {
    throw new HttpError(400, "No hay campos para actualizar").setErrors([
      { codigo: "El código de seguridad es requerido" },
    ]);
  }

  if (!/^\d{3,6}$/.test(codigo)) {
    throw new HttpError(400, "Código de seguridad inválido").setErrors([
      { codigo: "El código debe tener entre 3 y 6 dígitos" },
    ]);
  }

  const tarjetaActualizada = await tarjetaRepository.update(id, { codigo });
  return { data: tarjetaActualizada };
};

const deleteService = async (req) => {
  const { id } = req.params;
  const tarjeta = await tarjetaRepository.findById(id);
  if (!tarjeta || !tarjeta.activo) throw new HttpError(404, "Tarjeta no encontrada");
  if (tarjeta.idUsuario !== req.user.id) {
    throw new HttpError(403, "No tienes permiso para modificar esta tarjeta");
  }
  await tarjetaRepository.update(id, { activo: false });
  return true;
};

module.exports = {
  getAllService,
  getByIdService,
  createService,
  updateService,
  deleteService,
  getByUserService,
};
