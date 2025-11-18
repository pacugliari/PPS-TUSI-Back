const ResponseBuilder = require("../utils/api-response");
const {
  getAllService,
  getByIdService,
  createService,
  markDeliveredService,
} = require("../services/ordencompra");

const getAllController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await getAllService(req),
      "Ordenes de Compras consultadas exitosamente"
    )
  );
};

const getByIdController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await getByIdService(req),
      "Orden de Compra consultada exitosamente"
    )
  );
};

const createController = async (req, res) => {
  res.status(201).json(
    ResponseBuilder.success(
      await createService(req),
      "Orden de compra generada exitosamente"
    )
  );
};

const markDeliveredController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await markDeliveredService(req),
      "Orden marcada como entregada"
    )
  );
};

module.exports = {
  getAllController,
  getByIdController,
  createController,
  markDeliveredController,
};
