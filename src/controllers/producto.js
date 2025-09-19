const ResponseBuilder = require("../utils/api-response");
const { getAllService, getByIdService } = require("../services/producto");

const getAllController = async (req, res) => {
  res
    .status(200)
    .json(
      ResponseBuilder.success(
        await getAllService(req),
        "Productos consultados exitosamente"
      )
    );
};

const getByIdController = async (req, res) => {
  res
    .status(200)
    .json(
      ResponseBuilder.success(
        await getByIdService(req),
        "Producto consultado exitosamente"
      )
    );
};

module.exports = {
  getAllController,
  getByIdController,
};
