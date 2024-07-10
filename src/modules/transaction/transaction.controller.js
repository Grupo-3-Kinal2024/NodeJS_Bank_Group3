import Transaction from "./transaction.model.js";
import User from "../user/user.model.js";
import Account from "../account/account.model.js";
import { validateUserRequest, validateAdminRequest } from "../../helpers/controller-checks.js"
import { handleResponse, handleResponseWithMessage } from "../../helpers/handle-resp.js"
import mongoose from "mongoose";
import { logger } from "../../helpers/logger.js";
import { validateAmount, validateExistentNumberAccount } from "../../helpers/data-methods.js";

export const createTransaction = async (req, res) => {
    logger.info('Starting transaction creation');
    const { type, sourceAccount, destinationAccount, amount, enterprise, nit, description } = req.body;
    await validateUserRequest(req, res);
    const session = await mongoose.startSession();
    session.startTransaction();
    let sourceAccountTransaction = null;
    try {
        sourceAccountTransaction = await Account.findOne({ Number })
    } catch (error) {
        logger.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    handleResponse(res, Transaction.create({ type, sourceAccount, destinationAccount, amount, enterprise, nit, description }));
}

//Transferir - users
export const createTransfer = async (req, res) => {
    logger.info('Starting transaction transfer');
    const { sourceAccount, destinationAccount, amount, description } = req.body;
    const type = 'TRANSFER';

    await validateUserRequest(req, res);
    const validationToTransfer = await validateAmount(sourceAccount, amount);
    const validationNumber = await validateExistentNumberAccount(destinationAccount);
    const session = await mongoose.startSession();
    if (validationToTransfer && validationNumber) {
        session.startTransaction();
        let sourceAccountTransaction = null;
        try {
            sourceAccountTransaction = await Account.findOne({ Number })
        } catch (error) {
            logger.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
        handleResponse(res, Transaction.create({ type, sourceAccount, destinationAccount, amount, description }));
        await Account.findOneAndUpdate({ numberAccount: sourceAccount }, { $inc: { credit: -amount } });
        await Account.findOneAndUpdate({ numberAccount: destinationAccount }, { $inc: { credit: amount } });
        await session.commitTransaction();
    }
    else {
        res.status(500).json({ error: 'Error in the transaction, please check the data' });
    }
    session.endSession();
}

//Tomar todas las transacciones de un user
export const getAllMyTransactions = async (req, res) => {
    // A que cuenta ingreso... dado en el Frontend
    logger.info('Getting all my transactions by the id of the user');
    const { numberAccount } = req.params;
    await validateUserRequest(req, res);
    const source = await Transaction.find({ sourceAccount: numberAccount })
    const destination = await Transaction.find({ destinationAccount: numberAccount })
    const allTransactions = source.concat(destination);
    handleResponseWithMessage(res, allTransactions);
    //handleResponse(res, Transaction.find({ sourceAccount: sourceAccount}));
}

//Tomar transacciones de un account-user
export const getTransaction = async (req, res) => {
    logger.info('Getting tansaction by numberAccount');
    const { numberAccount } = req.body;
    await validateAdminRequest(req, res);
    const source = await Transaction.find({ sourceAccount: numberAccount })
    const destination = await Transaction.find({ destinationAccount: numberAccount })
    const allTransactions = source.concat(destination);
    handleResponseWithMessage(res, allTransactions);
}

//Depositar a una cuenta - Admin
export const createDeposit = async (req, res) => {
    logger.info('Starting deposit');
    const { destinationAccount, amount } = req.body;
    const type = 'DEPOSIT';
    await validateAdminRequest(req, res);
    const validationNumber = await validateExistentNumberAccount(destinationAccount);
    const session = await mongoose.startSession();
    if (validationNumber && amount > 0) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            handleResponse(res, Transaction.create({ type, destinationAccount, amount }));
            await Account.findOneAndUpdate({ numberAccount: destinationAccount }, { $inc: { credit: amount } });
        } catch (error) {
            logger.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
        await session.commitTransaction();

    } else {
        res.status(500).json({ error: 'Error in the deposit, please check the data' });
    }
    session.endSession();
}

//Revertir una depósito - Admin
export const revertTransaction = async (req, res) => {
    logger.info('Reversing Deposite');
    const { id } = req.body;

}






export const getTransactionsByType = async (req, res) => {
    logger.info('Getting transactions by type');
    const { type, sourceAccount } = req.body;
    await validateUserRequest(req, res);
    handleResponse(res, Transaction.find({ type: type, status: true, sourceAccount: sourceAccount }));
}

export const getTransactionsByProcess = async (req, res) => {
    logger.info('Getting transactions by process');
    const { process, sourceAccount } = req.body;
    await validateUserRequest(req, res);
    handleResponse(res, Transaction.find({ process: process, status: true, sourceAccount: sourceAccount }));
}




export const editTransaction = async (req, res) => {
    logger.info('Start editing Transaction');
    const { id } = req.params;
    const { amount } = req.body;
    await validateUserRequest(req, res);
    const newData = { amount };
    handleResponse(res, Transaction.findByIdAndUpdate({ _id: id, status: true }, { $set: newData }, { new: true }));
}