const ResponseBuilder = require("../utils/api-response");
const { getAllService, getByIdService } = require("../services/envio");

const getAllController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await getAllService(req),
      "Envios consultados exitosamente"
    )
  );
};

const getByIdController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await getByIdService(req),
      "Envio consultado exitosamente"
    )
  );
};

module.exports = {
  getAllController,
  getByIdController
};
