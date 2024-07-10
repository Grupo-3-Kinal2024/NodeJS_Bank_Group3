import { Router } from 'express';
import { check } from 'express-validator';
import { validateJWT } from '../../middlewares/validate-jwt.js';
import { validateFields } from '../../middlewares/validate-fields.js';
import { getAllFavorites, addFavorite, deleteFavorite } from './favorite.controller.js';

const router = Router();

router.get("/",  validateJWT, getAllFavorites)

router.delete("/:id", validateJWT, deleteFavorite);

router.post(
    "/fav",[
        validateJWT,
        check("numberAccount", "The number of the account cant be empty").not().isEmpty(),
        check("DPIFavorite", "The dpi from your favorite cant be empty").not().isEmpty(),
        check("DPIPersonal", "Your DPI cant be empty").not().isEmpty(),
        check("alias","The alias cant be empty").not().isEmpty(),
        validateFields
    ], addFavorite
)


export default router;