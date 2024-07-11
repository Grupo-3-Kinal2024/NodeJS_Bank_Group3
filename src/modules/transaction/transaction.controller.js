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

export const getTransactionToDetails = async (numberAccount) => {
    logger.info('Getting tansaction by numberAccount');
    const source = await Transaction.find({ sourceAccount: numberAccount })
    const destination = await Transaction.find({ destinationAccount: numberAccount })
    const allTransactions = source.concat(destination);
    handleResponseWithMessage(res, allTransactions);
}

//Depositar a una cuenta - Admin
export const createDeposit = async (req, res) => {
    logger.info('Starting deposit');
    const { adminId, destinationAccount, amount } = req.body;
    const type = 'DEPOSIT';
    await validateAdminRequest(req, res);
    const date = new Date();
    const validationNumber = await validateExistentNumberAccount(destinationAccount);
    if (validationNumber && amount > 0) {

        try {
            handleResponse(res, Transaction.create({ type, adminId, date, destinationAccount, amount }));
            await Account.findOneAndUpdate({ numberAccount: destinationAccount }, { $inc: { credit: amount } });
        } catch (error) {
            logger.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }

    } else {
        res.status(500).json({ error: 'Error in the deposit, please check the data' });
    }
}

//Revertir un deposito - Admin
export const revertTransaction = async (req, res) => {
    logger.info('Reversing Deposite');
    const { id } = req.params;
    await validateAdminRequest(req, res);
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const deposit = await Transaction.findById(id);
        let currentTimestamp = Date.now();
        let depositTimestamp = new Date(deposit.date).getTime();
        console.log("Dato supuesto estático: ", deposit.date);
        let timeDifference = (currentTimestamp / 1000) - (depositTimestamp / 1000);
        let numbreAccount = deposit.destinationAccount;


        console.log("Tiempo actual 1: ", currentTimestamp / 1000);
        console.log("Tiempo del deposito 1: ", depositTimestamp / 1000);
        console.log("Diferencia de tiempo 1: ", timeDifference);
        //Esperar 1 segundo para probar

        if (timeDifference > 60.01) {
            console.log("Han pasado más de 60 segundos");
            return res.status(500).json({ error: 'The deposit can no longer be reversed' });
        } else {
            console.log("Han pasado menos de 60 segundos");
            await Account.findOneAndUpdate({ numberAccount: numbreAccount }, { $inc: { credit: -deposit.amount } });
            await Transaction.findByIdAndUpdate(id, { $set: { status: false } });
            return res.status(200).json({ error: 'Transaction reversed' });
        }

    } catch (error) {
        logger.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

    await session.commitTransaction();
    session.endSession();

}


//Ver depositos que ha hecho un admin
export const getDepositsByAdmin = async (req, res) => {
    logger.info('Getting deposits by admin');
    const { adminId } = req.params;
    handleResponse(res, Transaction.find({ adminId: adminId, type: "DEPOSIT", status: true }));
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