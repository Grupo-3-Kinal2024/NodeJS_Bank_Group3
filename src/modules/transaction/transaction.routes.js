import { Router } from 'express';
import { check } from 'express-validator';
import { validateJWT } from '../../middlewares/validate-jwt.js';
import { validateFields } from '../../middlewares/validate-fields.js';
import { createTransaction, createTransfer, editTransaction, getAllMyTransactions, getTransaction, getTransactionsByType, getTransactionsByProcess, revertTransaction, createDeposit } from './transaction.controller.js';

const router = Router();

//transferir - users
router.post(
    '/transfer',
    [
        validateJWT,
        check('sourceAccount', 'Source account is required').not().isEmpty(),
        check('destinationAccount', 'Destination account is required').not().isEmpty(),
        check('amount', 'Amount is required').not().isEmpty(),
        check('description', 'Description is required').not().isEmpty(),
        validateFields
    ],
    createTransfer
);

//ver transacciones - user
router.get(
    '/my-transactions',
    [
        validateJWT
    ],
    getAllMyTransactions
);

//ver transacciones de un user - Admin
router.get(
    '/user-transactions',
    [
        validateJWT
    ],
    getTransaction
);

//Depositar a una cuenta - Admin
router.post(
    '/deposit',
    [
        validateJWT,
        check('sourceAccount', 'Source account is required').not().isEmpty(),
        check('amount', 'Amount is required').not().isEmpty(),
        validateFields
    ],
    createDeposit
);



export default router;