import { Router } from 'express';
import { check } from 'express-validator';
import { validateJWT } from '../../middlewares/validate-jwt.js';
import { validateFields } from '../../middlewares/validate-fields.js';
import { createAccount, getAccounts, getAccount, updateAccount, deleteAccount, getAccountDetails,  } from './account.controller.js';

const router = Router();

router.post(
    "/new", [
    validateJWT,
    check('salary', 'The salary is required').not().isEmpty(),
    check('credit', 'The credit is required').not().isEmpty(),
    validateFields
]
    , createAccount);

router.get("/", validateJWT, getAccounts);

router.get("/:id", validateJWT, getAccount);

router.get("/getDetails/:id", validateJWT, getAccountDetails);


router.put("/:id", [
    validateJWT,
    check('salary', 'The salary is required').not().isEmpty(),
    check('credit', 'The credit is required').not().isEmpty(),
    validateFields
], updateAccount);

router.delete("/:id", validateJWT, deleteAccount);

export default router;
