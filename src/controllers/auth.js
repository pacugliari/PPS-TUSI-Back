const { register, login } = require("../services/auth-jwt");
const ResponseBuilder = require("../utils/api-response");

const registerController = async (req, res) => {
  await register(req);
  res
    .status(200)
    .json(ResponseBuilder.success(null, "Usuario registrado exitosamente"));
};

const loginController = async (req, res) => {
  res
    .status(200)
    .json(
      ResponseBuilder.success(
        await login(req),
        "Usuario autenticado exitosamente"
      )
    );
};

module.exports = {
  registerController,
  loginController,
};
