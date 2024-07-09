import { Router } from 'express';
import { check } from 'express-validator';
import { validateJWT } from '../../middlewares/validate-jwt.js';
import { validateFields } from '../../middlewares/validate-fields.js';
import { createTransaction, createTransfer, editTransaction, getTransactions, getTransaction, getTransactionsByType, getTransactionsByProcess, revertTransaction } from './transaction.controller.js';

const router = Router();

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

export default router;