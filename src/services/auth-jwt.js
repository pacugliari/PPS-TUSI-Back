const HttpError = require("../utils/http-error");
const bcrypt = require("bcryptjs");
const { Usuario, Rol, Perfil } = require("../models");
const { isValidEmail, isValidPassword } = require("../utils/validators");

const DEFAULT_USER_ROLE_ID = 3;

const register = async (req) => {
  const { email, password, confirmPassword, compraOnline = false } = req.body;

  if (!isValidEmail(email)) {
    throw new HttpError(400, "Email inválido").setErrors([
      { email: "El formato del email no es válido" },
    ]);
  }

  if (!isValidPassword(password)) {
    throw new HttpError(400, "Contraseña inválida").setErrors([
      { password: "Debe tener al menos 8 caracteres, una letra y un número" },
    ]);
  }

  if (!confirmPassword) {
    throw new HttpError(400, "Falta confirmación de contraseña").setErrors([
      { confirmPassword: "Debe ingresar la confirmación" },
    ]);
  }

  if (password !== confirmPassword) {
    throw new HttpError(400, "Las contraseñas no coinciden").setErrors([
      { password: "Las contraseñas ingresadas deben ser iguales" },
    ]);
  }

  const exist = await Usuario.findOne({ where: { email } });
  if (exist) {
    throw new HttpError(400, "Ya existe el usuario").setErrors([
      { email: "Este email ya está registrado" },
    ]);
  }

  const hashed = await bcrypt.hash(password, 10);

  await Usuario.create({
    email,
    password: hashed,
    compraOnline: !!compraOnline,
    idRol: DEFAULT_USER_ROLE_ID,
  });
};

const login = async (req) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new HttpError(400, "Email y contraseña son obligatorios").setErrors([
      ...(email ? [] : [{ email: "El email es requerido" }]),
      ...(password ? [] : [{ password: "La contraseña es requerida" }]),
    ]);
  }

  const { signToken } = await import("../utils/jwt.mjs");

  const user = await Usuario.findOne({
    where: { email },
    include: [
      { model: Rol, as: "rol", attributes: ["idRol", "nombre", "tipo"] },
      {
        model: Perfil,
        as: "perfil",
        attributes: ["nombre"],
      },
    ],
  });

  const valid = user ? await bcrypt.compare(password, user.password) : false;
  if (!user || !valid) {
    throw new HttpError(400, "Credenciales inválidas").setErrors([
      { credentials: "Email o contraseña incorrectos" },
    ]);
  }

  const plain = user.get({ plain: true });
  delete plain.password;

  const roleInfo = plain.rol
    ? { idRol: plain.rol.idRol, tipo: plain.rol.tipo, nombre: plain.rol.nombre }
    : null;

  return {
    token: await signToken({
      id: plain.idUsuario,
      email: plain.email,
      role: roleInfo?.tipo || null,
      profileId: plain.perfil?.idPerfil ?? null,
    }),
    user: {
      id: plain.idUsuario,
      email: plain.email,
      role: roleInfo,
      compraOnline: plain.compraOnline,
      perfil: plain.perfil || null,
    },
  };
};
module.exports = { register, login };
