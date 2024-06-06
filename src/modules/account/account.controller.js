import { validateUser } from '../../helpers/data-methods.js';
import { isToken } from '../../helpers/tk-methods.js';
import Account from './account.model.js';

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
    const { numberAccount, salary, credit } = req.body;
    await validateUserRequest(req, res);
    handleResponse(res, Account.create({ numberAccount, salary, credit }));
}

export const getAccounts = async (req, res) => {
    await validateUserRequest(req, res);
    handleResponse(res, Account.find({status: true}));
}

export const getAccount = async (req, res) => {
    const { id } = req.params;
    await validateUserRequest(req, res);
    handleResponse(res, Account.findById(id));
}

export const updateAccount = async (req, res) => {
    const { id } = req.params;
    const {salary, credit } = req.body;
    await validateUserRequest(req, res);
    const newData = {salary, credit};
    handleResponse(res, Account.findByIdAndUpdate({ _id: id, status: true }, { $set: newData }, { new: true }));
}

export const deleteAccount = async (req, res) => {
    const { id } = req.params;
    await validateUserRequest(req, res);
    handleResponse(res, Account.findByIdAndUpdate({ _id: id, status: true }, { $set: { status: false } }, { new: true }));
}