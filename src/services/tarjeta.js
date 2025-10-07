const HttpError = require("../utils/http-error");
const tarjetaRepository = require("../repositories/tarjeta");

const getAllService = async (req) => {
  try {
    const { rows } = await tarjetaRepository.findAll();
    return rows;
  } catch (err) {
    throw new HttpError(500, "No se pudieron obtener las tarjetas");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const tarjeta = await tarjetaRepository.findById(id);
  if (!tarjeta) throw new HttpError(404, "Tarjeta no encontrada");
  return { data: tarjeta };
};

const createService = async (req) => {
  const { idBanco, idUsuario, tipo, codigo, numero } = req.body;

  // Validaciones
  if (!idBanco || !idUsuario || !tipo || !codigo || !numero) {
    throw new HttpError(400, "Faltan campos requeridos").setErrors([
      ...(!idBanco ? [{ idBanco: "El banco es requerido" }] : []),
      ...(!idUsuario ? [{ idUsuario: "El usuario es requerido" }] : []),
      ...(!tipo ? [{ tipo: "El tipo de tarjeta es requerido" }] : []),
      ...(!codigo ? [{ codigo: "El código de seguridad es requerido" }] : []),
      ...(!numero ? [{ numero: "El número de tarjeta es requerido" }] : [])
    ]);
  }

  // Validar tipo de tarjeta
  if (!['VISA', 'MASTERCARD'].includes(tipo)) {
    throw new HttpError(400, "Tipo de tarjeta inválido").setErrors([
      { tipo: "El tipo de tarjeta debe ser VISA o MASTERCARD" }
    ]);
  }

  // Validar formato del código
  if (!/^\d{3,6}$/.test(codigo)) {
    throw new HttpError(400, "Código de seguridad inválido").setErrors([
      { codigo: "El código debe tener entre 3 y 6 dígitos" }
    ]);
  }

  // Validar formato del número de tarjeta (16 dígitos, puede incluir espacios)
  const numeroLimpio = numero.replace(/\s/g, '');
  if (!/^\d{16}$/.test(numeroLimpio)) {
    throw new HttpError(400, "Número de tarjeta inválido").setErrors([
      { numero: "El número debe contener 16 dígitos" }
    ]);
  }

  // Verificar si ya existe una tarjeta con el mismo número
  const tarjetaExistente = await tarjetaRepository.findOne({ numero: numeroLimpio });
  if (tarjetaExistente) {
    throw new HttpError(400, "La tarjeta ya existe").setErrors([
      { numero: "Ya existe una tarjeta registrada con este número" }
    ]);
  }

  const tarjeta = await tarjetaRepository.create({
    idBanco,
    idUsuario,
    tipo,
    codigo,
    numero: numeroLimpio
  });
  return { data: tarjeta };
};

const updateService = async (req) => {
  const { id } = req.params;
  const { codigo } = req.body; // Solo permitimos actualizar el código de seguridad

  const tarjeta = await tarjetaRepository.findById(id);
  if (!tarjeta) throw new HttpError(404, "Tarjeta no encontrada");

  if (!codigo) {
    throw new HttpError(400, "No hay campos para actualizar").setErrors([
      { codigo: "El código de seguridad es requerido" }
    ]);
  }

  // Validar formato del código
  if (!/^\d{3,6}$/.test(codigo)) {
    throw new HttpError(400, "Código de seguridad inválido").setErrors([
      { codigo: "El código debe tener entre 3 y 6 dígitos" }
    ]);
  }

  const tarjetaActualizada = await tarjetaRepository.update(id, { codigo });
  return { data: tarjetaActualizada };
};

const deleteService = async (req) => {
  const { id } = req.params;
  const tarjeta = await tarjetaRepository.findById(id);
  if (!tarjeta) throw new HttpError(404, "Tarjeta no encontrada");
  await tarjetaRepository.remove(id);
  return true;
};

module.exports = {
  getAllService,
  getByIdService,
  createService,
  updateService,
  deleteService
};
