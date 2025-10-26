const ResponseBuilder = require("../utils/api-response");
const perfilService = require("../services/perfil");
const direccionService = require("../services/direccion");

// GET /checkout/options
const getCheckoutOptionsController = async (req, res) => {
    try {
        const perfil = await perfilService.getFullProfileByUserService(req);
        const direcciones = await direccionService.getCheckoutAddressesService(req);

        const payload = { perfil, direcciones };
        return res
            .status(200)
            .json(
                ResponseBuilder.success(
                    payload,
                    "Opciones de checkout consultadas exitosamente",
                    200
                )
            );
    } catch (err) {
        const status = err.statusCode || 500;
        return res
            .status(status)
            .json(ResponseBuilder.error(err.message || "Error de servidor", [], status));
    }
};

module.exports = { getCheckoutOptionsController };
