import User from '../modules/user/user.model.js';
import Account from '../modules/account/account.model.js';
import zxcvbn from 'zxcvbn';

export const validateUser = async (id) => {
    const user = await User.findById(id);
    if (!user) { throw new Error('User not found') }
    if (!user.status) { throw new Error('User is not active') }
    const userData = { id: user.id, name: user.name, email: user.email, role: user.role };
    return userData;
}

export const validateAdmin = async (id) => {
    const user = await User.findById(id);
    if (!user) { throw new Error('User not found') }
    if (!user.status) { throw new Error('User is not active') }
    if (user.role !== 'ADMIN') { throw new Error('User is not an administrator') }
    const userData = { id: user.id, name: user.name, email: user.email, role: user.role };
    return userData;
}

export const validateEmail = async (email) => {
    if (!email) { throw new Error('Email is required') }
    if (typeof email !== 'string') { throw new Error('Email must be a string') }
    if (!email.includes('@') || !email.includes('.')) { throw new Error('Email is not valid') }
    return email;
}

export const validateExistentEmail = async (email) => {
    const user = await User.findOne({ email });
    if (user) { throw new Error('Email already exists') }
    return email;
}

export const validateExistentNumberAccount = async (numberAccount) => {
    const existence = await Account.findOne({ numberAccount: numberAccount });
    return existence == null ? false : true;
}

export const validatePassword = async (password) => {
    const result = zxcvbn(password);

    if (result.score < 2) {
        throw new Error(`The password is not safe enough.`);
    }
    if (password.length < 6) {
        throw new Error('The password must be at least 6 characters.');
    }
};

export const validateAmount = async (account, mount) => {

    const acount = await Account.findOne({ numberAccount: account });
    return acount.credit < mount ? false : true;

}

export const validateExistentDPI = async (DPI) => {
    const dpi = await User.findOne({ DPI });
    if (dpi) { throw new Error(`DPI already is registered`) }
}

export const validateExistentUserName = async (userName) => {
    const uName = await User.findOne({ userName });
    if (uName) { throw new Error(`The userName already is registered ${uName}`) }
}

export const validateExistentPhone = async (phone) => {
    const pho = await User.findOne({ phone });
    if (pho) { throw new Error('Phone already exists') }
}

