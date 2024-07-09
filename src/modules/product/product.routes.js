import { Router } from 'express';
import { check } from 'express-validator';
import { validateJWT } from '../../middlewares/validate-jwt.js';
import { validateFields } from '../../middlewares/validate-fields.js';
import { createProductServiceDiscount, getAllProductsAndServices, deleteProductService } from './product.controller.js';

const router = Router();

router.post(
    '/create',
    [
        validateJWT,
        check('name', 'Name is required').not().isEmpty(),
        check('description', 'Description is required').not().isEmpty(),
        check('enterprice', 'Enterprice is required').not().isEmpty(),
        validateFields
    ],
    createProductServiceDiscount
);

router.get(
    '/',
    [
        validateJWT
    ],
    getAllProductsAndServices
);

router.delete(
    '/delete',
    [
        validateJWT
    ],
    deleteProductService
);


export default router;