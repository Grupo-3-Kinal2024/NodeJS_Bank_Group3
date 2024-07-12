import bcryptjs from "bcryptjs";
import User from "./user.model.js";
import Account from '../account/account.model.js';
import { isToken } from '../../helpers/tk-methods.js';
import { handleResponse } from "../../helpers/handle-resp.js"
import Transactions from "../transaction/transaction.model.js";
import { logger } from "../../helpers/logger.js";


export const userPut = async (req, res) => {
  logger.info('Updating user');
  const { name, lastName, userName, email, pass, phone, address, jobName } = req.body;
  const user = await isToken(req, res);
  const newData = { name, lastName, userName, email, phone, address, jobName };
  if (pass) {
    const salt = bcryptjs.genSaltSync();
    newData.pass = bcryptjs.hashSync(pass, salt);
  }
  handleResponse(res, User.findOneAndUpdate({ _id: user._id, status: true }, { $set: newData }, { new: true }));
};

export const getAllUsers = async (req, res) => {
  logger.info('Getting all users');
  handleResponse(res, User.find({ status: true }));
};

export const userEdit = async (req, res) => {
  logger.info('Editing user');
  const { id } = req.params;
  const { name, lastName, userName, email, pass, phone, address, jobName } = req.body;

  const newData = { name, lastName, userName, email, phone, address, jobName };

  if (pass) {
    const salt = bcryptjs.genSaltSync();
    newData.pass = bcryptjs.hashSync(pass, salt);
  }

  handleResponse(res, User.findOneAndUpdate({ _id: id, status: true }, { $set: newData }, { new: true }));
};

export const userDelete = async (req, res) => {
  logger.info('Deleting user');
  const { id } = req.params;
  const user = await isToken(req, res);

  // Verificar si el usuario a eliminar es un administrador
  const userToDelete = await User.findById(id);
  if (userToDelete.role === 'ADMIN') {
    return res.status(403).send('No se puede eliminar a otro administrador');
  }

  // Desactivar el usuario
  await User.findByIdAndUpdate(id, { status: false }, { new: true });

  // Desactivar todas las cuentas asociadas al usuario
  await Account.updateMany({ numberAccount: { $in: userToDelete.accounts } }, { status: false });

  res.status(200).json({ message: 'Usuario y sus cuentas desactivados correctamente' });
};


export const getEnterpriseUsers = async (req, res) => {
  logger.info('Getting enterprise users');
  const users = await User.find({ status: true, role: 'ENTERPRISE' }).lean();
  const userWithAccountsPromises = users.map(async (user) => {
    const accounts = await Account.find({ numberAccount: { $in: user.accounts }, status: true }).lean();
    return {
      ...user,
      accounts: accounts
    };
  });

  const usersWithAccountsPromise = Promise.all(userWithAccountsPromises);
  handleResponse(res, usersWithAccountsPromise);
};


export const getAllUsersWithAccounts = async (req, res) => {
  logger.info("Getting all users with accounts");

  try {
    const users = await User.find({ status: true }).lean();
    const userWithAccountsPromises = users.map(async (user) => {
      const accounts = await Account.find({ numberAccount: { $in: user.accounts }, status: true }).lean();

      const accountsWithTransactionsPromises = accounts.map(async (account) => {
        const transactions = await Transactions.find({
          $or: [
            { sourceAccount: account.numberAccount },
            { destinationAccount: account.numberAccount }
          ],
          status: true
        }).lean();
        const numberTransactions = transactions.length;
        return {
          ...account,
          numberTransactions: numberTransactions
        };
      });
      const accountsWithTransactions = await Promise.all(accountsWithTransactionsPromises);

      return {
        ...user,
        accounts: accountsWithTransactions
      };
    });

    const usersWithAccounts = await Promise.all(userWithAccountsPromises);

    res.json(usersWithAccounts);
  } catch (error) {
    logger.error(`Error getting users with accounts: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};



export const getAllUsersWithAccountsById = async (req, res) => {
  logger.info("Getting all users with accounts");

  const user = await isToken(req, res);
  console.log(user.id)
  const users = await User.find({ _id: user._id, status: true }).lean();

  const userWithAccountsPromises = users.map(async (user) => {
    const accounts = await Account.find({ numberAccount: { $in: user.accounts }, status: true }).lean();
    return {
      ...user,
      accounts: accounts
    };
  });

  const usersWithAccountsPromise = Promise.all(userWithAccountsPromises);

  handleResponse(res, usersWithAccountsPromise);

};


