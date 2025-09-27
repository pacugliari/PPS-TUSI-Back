const ResponseBuilder = require("../utils/api-response");
const comentarioService = require("../services/comentario");

const getAllController = async (req, res) => {
  try {
    const result = await comentarioService.getAllService(req);
    res.status(200).json(
      ResponseBuilder.success(
        result,
        "Comentarios consultados exitosamente"
      )
    );
  } catch (err) {
    next(err);
  }
};

const getByIdController = async (req, res) => {
  try {
    const result = await comentarioService.getByIdService(req);
    res.status(200).json(
      ResponseBuilder.success(
        result,
        "Comentario consultado exitosamente"
      )
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllController,
  getByIdController,
};
