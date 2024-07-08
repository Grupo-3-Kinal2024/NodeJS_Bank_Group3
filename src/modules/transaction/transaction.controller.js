import Transaction from "./transaction.model";
import Account from "../account/account.model";
import { validateUserRequest } from "../../helpers/controller-checks.js"
import { handleResponse } from "../../helpers/handle-resp.js"
import { logger } from "../../helpers/logger.js";

export const createTransaction = async (req, res) => {
    logger.info('Starting transaction creation');
    const { type, sourceAccount, destinationAccount, amount, enterprise, nit, description } = req.body;
    await validateUserRequest(req, res);
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const sourceAccountTransaction = await Account.findOne({Number})
    }catch(error){
        logger.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    handleResponse(res, Transaction.create({ type, sourceAccount, destinationAccount, amount, enterprise, nit, description }));
}

export const editTransaction = async (req, res) => {
    logger.info('Start editing Transaction');
    const { id } = req.params;
    const { amount } = req.body;
    await validateUserRequest(req, res);
    const newData = { amount };
    handleResponse(res, Transaction.findByIdAndUpdate({ _id: id, status: true }, { $set: newData }, { new: true }));
}

export const getTransactions = async (req, res) => {
    // A que cuenta ingreso... dado en el Frontend
    logger.info('Getting transactions by source account');
    const { sourceAccount } = req.body;
    await validateUserRequest(req, res);
    handleResponse(res, Transaction.find({ sourceAccount: sourceAccount }));
}

export const getTransaction = async (req, res) => {
    logger.info('Getting tansaction by Id');
    const { id } = req.params;
    await validateUserRequest(req, res);
    handleResponse(res, Transaction.findById(id));
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

export const revertTransaction = async (req, res) => {
    logger.info('Reversing transaction');
    const { id } = req.params;    
    await validateUserRequest(req, res);
    handleResponse(res, Transaction.findByIdAndUpdate({ _id: id, status: true }, { $set: { status: false } }, { new: true }));
}