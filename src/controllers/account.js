const direccionService = require("../services/direccion");
const zonaService = require("../services/zona");
const productoService = require("../services/producto");
const perfilService = require("../services/perfil");
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

const getFavoritesController = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) {
            return res.status(400).json(ResponseBuilder.error("Debe enviar un array de ids", 400));
        }
        const result = await productoService.getByIdsService(ids);
        res.status(200).json(
            ResponseBuilder.success(result, "Productos favoritos consultados exitosamente")
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
        res.status(200).json(
            ResponseBuilder.success("Dirección borrada exitosamente")
        );
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json(ResponseBuilder.error(err.message, status));
    }
};

const setPrimaryAddressController = async (req, res) => {
    try {
        const result = await direccionService.setPrimaryService(req);
        res.status(200).json(
            ResponseBuilder.success(result, "Dirección principal actualizada exitosamente")
        );
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json(ResponseBuilder.error(err.message, status));
    }
};

const getZonesController = async (req, res) => {
    try {
        const result = await zonaService.getAllService(req);
        res.status(200).json(
            ResponseBuilder.success(result, "Zonas consultadas exitosamente")
        );
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json(ResponseBuilder.error(err.message, status));
    }
};

const getProfileController = async (req, res) => {
    try {
        const result = await perfilService.getProfileService(req);
        res.status(200).json(
            ResponseBuilder.success(result, "Perfil obtenido correctamente")
        );
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json(ResponseBuilder.error(err.message, status));
    }
};

module.exports = {
    getAccountAddressesController,
    getFavoritesController,
    postAccountAddressController,
    putAccountAddressController,
    deleteAccountAddressController,
    setPrimaryAddressController,
    getZonesController,
    getProfileController,
};
