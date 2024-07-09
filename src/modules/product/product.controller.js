import Product from './product.model.js';
import { validateUserRequest, validateAdminRequest } from "../../helpers/controller-checks.js"
import { handleResponse, handleResponseWithMessage } from "../../helpers/handle-resp.js"
import { logger } from "../../helpers/logger.js";

export const createProductServiceDiscount = async (req, res) => {
    logger.info('Starting product/Service creation');
    const { type, name, description, enterprice, discount } = req.body;

    await validateAdminRequest(req, res);
    handleResponse(res, Product.create({ type, name, description, enterprice, discount }));
}

export const getAllProductsAndServices = async (req, res) => {
    logger.info('Getting all products/Services');
    await validateAdminRequest(req, res);
    handleResponse(res, Product.find({}));
}

export const deleteProductService = async (req, res) => {
    logger.info('Starting product/Service deletion');
    const { id } = req.body;
    await validateAdminRequest(req, res);
    handleResponse(res, Product.findByIdAndDelete(id));
}


