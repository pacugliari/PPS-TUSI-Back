const ResponseBuilder = require("../utils/api-response");
const {
  getAllService,
  getByUserService,
  approveService,
  rejectService,
  confirmService,
} = require("../services/devolucion");

const getAllController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await getAllService(req),
      "Devoluciones consultadas exitosamente"
    )
  );
};

const getUserController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await getByUserService(req),
      "Devoluciones consultadas exitosamente"
    )
  );
};

const approveController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await approveService(req),
      "Devolución aprobada exitosamente"
    )
  );
};

const rejectController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await rejectService(req),
      "Devolución rechazada exitosamente"
    )
  );
};

const confirmController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await confirmService(req),
      "Devolución confirmada exitosamente"
    )
  );
};

module.exports = {
  getAllController,
  getUserController,
  approveController,
  rejectController,
  confirmController,
};
