const HttpError = require("../utils/http-error");
const bcrypt = require("bcryptjs");
const { Usuario, Rol } = require("../models");
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
    ],
  });

  const valid = user ? await bcrypt.compare(password, user.password) : false;

  if (!user || !valid) {
    throw new HttpError(400, "Credenciales inválidas").setErrors([
      { credentials: "Email o contraseña incorrectos" },
    ]);
  }

  // Plano sin password
  const plain = user.get ? user.get({ plain: true }) : user.toJSON?.() || {};
  delete plain.password;

  // Elegí qué campo del rol querés en el token/respuesta (tipo o nombre)
  const roleInfo = user.rol
    ? { idRol: user.rol.idRol, tipo: user.rol.tipo, nombre: user.rol.nombre }
    : null;

  return {
    token: await signToken({
      id: user.idUsuario, // ✅ tu PK real
      email: user.email,
      role: roleInfo?.tipo || null, // ej: 'administrador' | 'operario' | 'usuario'
    }),
    user: {
      id: user.idUsuario,
      email: user.email,
      role: roleInfo, // te dejo todo el objeto del rol
      compraOnline: user.compraOnline,
    },
  };
};

module.exports = { register, login };
