const direccionService = require("../services/direccion");
const ResponseBuilder = require("../utils/api-response");

const getAccountAddressesController = async (req, res) => {
    try {
        const result = await direccionService.getByUserService(req);
        res.status(200).json(
            ResponseBuilder.success(result, "Direcciones del usuario consultadas exitosamente")
        );
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json(ResponseBuilder.error(err.message, status));
    }
};

const postAccountAddressController = async (req, res) => {
    try {
        const result = await direccionService.createService(req);
        res.status(201).json(
            ResponseBuilder.success(result, "Dirección creada exitosamente", 201)
        );
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json(ResponseBuilder.error(err.message, status));
    }
};

const putAccountAddressController = async (req, res) => {
    try {
        // Opcional: podrías validar que la dirección pertenezca al usuario
        const result = await direccionService.updateService(req);
        res.status(200).json(
            ResponseBuilder.success(result, "Dirección actualizada exitosamente")
        );
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json(ResponseBuilder.error(err.message, status));
    }
};

const deleteAccountAddressController = async (req, res) => {
    try {
        await direccionService.deleteService(req);
        res.status(204).json();
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json(ResponseBuilder.error(err.message, status));
    }
};

module.exports = {
    getAccountAddressesController,
    postAccountAddressController,
    putAccountAddressController,
    deleteAccountAddressController,
};
