import { validateUser } from '../../helpers/data-methods.js';
import { isToken } from '../../helpers/tk-methods.js';
import randomatic from 'randomatic';
import Account from './account.model.js';
import User from '../user/user.model.js';
import { validateExistentNumberAccount } from '../../helpers/data-methods.js';

const handleResponse = (res, promise) => {
    promise
        .then(data => res.status(200).json(data))
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};

const validateUserRequest = async (req, res) => {
    try {
        const user = await isToken(req, res);
        validateUser(user._id);
        return true;
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export const createAccount = async (req, res) => {
    const { salary, credit, idUser } = req.body;
    await validateUserRequest(req, res);
    let numberAccount = 0;
    do {
        numberAccount = randomatic("0", 10);
    } while (await validateExistentNumberAccount(numberAccount));
    console.log("Debug id: ", idUser);
    handleResponse(res, Account.create({ numberAccount, salary, credit }));
    let accounts;
    accounts = await User.findById(idUser);
    accounts.accounts.push(numberAccount);
    await User.findByIdAndUpdate(idUser, { $set: { accounts: accounts.accounts } });
}


export const getAccounts = async (req, res) => {
    await validateUserRequest(req, res);
    handleResponse(res, Account.find({ status: true }));
}

export const getAccount = async (req, res) => {
    const { id } = req.params;
    await validateUserRequest(req, res);
    handleResponse(res, Account.findById(id));
}

export const updateAccount = async (req, res) => {
    const { id } = req.params;
    const { salary, credit } = req.body;
    await validateUserRequest(req, res);
    const newData = { salary, credit };
    handleResponse(res, Account.findByIdAndUpdate({ _id: id, status: true }, { $set: newData }, { new: true }));
}

export const deleteAccount = async (req, res) => {
    const { id } = req.params;
    await validateUserRequest(req, res);
    handleResponse(res, Account.findByIdAndUpdate({ _id: id, status: true }, { $set: { status: false } }, { new: true }));
}

// MOVIMIENTOS EN LA CUENTA PARA TRANSACCIONES

export const IncomeAccount = async (req, res) => {

}

export const EgressAccount = async (req, res) => {

}