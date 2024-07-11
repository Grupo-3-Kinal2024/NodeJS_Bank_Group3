import randomatic from 'randomatic';
import Account from './account.model.js';
import User from '../user/user.model.js';
import { validateExistentNumberAccount } from '../../helpers/data-methods.js';
import { validateUserRequest } from "../../helpers/controller-checks.js"
import { handleResponse } from "../../helpers/handle-resp.js"
import { logger } from "../../helpers/logger.js";
import { getUsage } from './account.utils.js';

export const createAccount = async (req, res) => {
    logger.info('Creating account');
    const { salary, credit, idUser } = req.body;
    await validateUserRequest(req, res);
    let numberAccount = 0;
    do {
        numberAccount = randomatic("0", 10);
    } while (await validateExistentNumberAccount(numberAccount));
    handleResponse(res, Account.create({ numberAccount, salary, credit }));
    let accounts;
    accounts = await User.findById(idUser);
    accounts.accounts.push(numberAccount);
    await User.findByIdAndUpdate(idUser, { $set: { accounts: accounts.accounts } });
}

export const getAccounts = async (req, res) => {
    logger.info("Getting accounts");
    await validateUserRequest(req, res);
    handleResponse(res, Account.find({ status: true }));
}

export const getAccount = async (req, res) => {
    logger.info("Getting account");
    const { id } = req.params;
    await validateUserRequest(req, res);
    handleResponse(res, Account.findById(id));
}

export const updateAccount = async (req, res) => {
    logger.info('Updating account');
    const { id } = req.params;
    const { salary, credit } = req.body;
    await validateUserRequest(req, res);
    const newData = { salary, credit };
    handleResponse(res, Account.findByIdAndUpdate({ _id: id, status: true }, { $set: newData }, { new: true }));
}

export const deleteAccount = async (req, res) => {
    logger.info('Deleting account');
    const { id } = req.params;
    await validateUserRequest(req, res);
    handleResponse(res, Account.findByIdAndUpdate({ _id: id, status: true }, { $set: { status: false } }, { new: true }));
}

// MOVIMIENTOS EN LA CUENTA PARA TRANSACCIONES

export const IncomeAccount = async (req, res) => {
    logger.info('Income account');
}

export const EgressAccount = async (req, res) => {
    logger.info('Egress account');
}

export const getAccountAscendantUsage = async (req, res) => {
    try {
        logger.info('Getting account ascendant usage');
    const accounts = await Account.find({ status: true });
    const promises = accounts.map((account) => getUsage(account));
    const accountUsage = await Promise.all(promises);
    accountUsage.sort((a, b) => a.totalUsage - b.totalUsage);
    const responseData = accountUsage.map((item) => ({
        account: item.account,
        totalUsage: item.totalUsage,
    }));

    res.status(200).json({
        message: 'Accounts retrieved successfully || sort by [asc]',
        data: responseData,
    });

    logger.info('Accounts [asc] retrieved successfully');
    } catch (error) {
        logger.error('Get account ascendant usage controller error of type: ', error.name);
    }
}

export const getAccountDescendantUsage = async (req, res) => {
    try {
        logger.info('Getting account descendant usage');
    const accounts = await Account.find({ status: true });
    const promises = accounts.map((account) => getUsage(account));
    const accountUsage = await Promise.all(promises);
    accountUsage.sort((a, b) => b.totalUsage - a.totalUsage);
    const responseData = accountUsage.map((item) => ({
        account: item.account,
        totalUsage: item.totalUsage,
    }));

    res.status(200).json({
        message: 'Accounts retrieved successfully || sort by [des] ',
        data: responseData,
    });

    logger.info('Accounts [des] retrieved successfully');
    } catch (error) {
        logger.error('Get account descendant usage controller error of type: ', error);
    }
}