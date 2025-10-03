const ResponseBuilder = require("../utils/api-response");
const comentarioService = require("../services/comentario");

const getAllController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await comentarioService.getAllService(req),
      "Comentarios consultados exitosamente"
    )
  );
};

const getByIdController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await comentarioService.getByIdService(req),
      "Comentario consultado exitosamente"
    )
  );
};

module.exports = {
  getAllController,
  getByIdController,
};
