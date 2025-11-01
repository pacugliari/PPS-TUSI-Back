const ResponseBuilder = require("../utils/api-response");
const {
  getAllService,
  getByIdService,
  getAllowedTransitionsService,
  transitionService,
} = require("../services/pedido");

const getAllController = async (req, res) => {
  try {
    const data = await getAllService(req);
    res
      .status(200)
      .json(ResponseBuilder.success(data, "Pedidos consultados exitosamente"));
  } catch (err) {
    const status = err.statusCode || 500;
    res
      .status(status)
      .json(ResponseBuilder.error(err.message || "Error interno", [], status));
  }
};

const getByIdController = async (req, res) => {
  try {
    const data = await getByIdService(req);
    res
      .status(200)
      .json(ResponseBuilder.success(data, "Pedido consultado exitosamente"));
  } catch (err) {
    const status = err.statusCode || 500;
    res
      .status(status)
      .json(ResponseBuilder.error(err.message || "Error interno", [], status));
  }
};

const getAllowedTransitionsController = async (req, res) => {
  try {
    const data = await getAllowedTransitionsService(req);
    res
      .status(200)
      .json(
        ResponseBuilder.success(
          data,
          "Transiciones permitidas obtenidas exitosamente"
        )
      );
  } catch (err) {
    const status = err.statusCode || 500;
    res
      .status(status)
      .json(ResponseBuilder.error(err.message || "Error interno", [], status));
  }
};

const transitionController = async (req, res) => {
  try {
    const data = await transitionService(req);
    res
      .status(200)
      .json(ResponseBuilder.success(data, "Transición aplicada correctamente"));
  } catch (err) {
    const status = err.statusCode || 500;
    res
      .status(status)
      .json(ResponseBuilder.error(err.message || "Error interno", [], status));
  }
};

module.exports = {
  getAllController,
  getByIdController,
  getAllowedTransitionsController,
  transitionController,
};
