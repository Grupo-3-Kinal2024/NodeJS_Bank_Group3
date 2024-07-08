import bcryptjs from "bcryptjs";
import User from "./user.model.js";
import { isToken } from '../../helpers/tk-methods.js';
import { handleResponse } from "../../helpers/handle-resp.js"
import { logger } from "../../helpers/logger.js";

export const userPut = async (req, res) => {
  logger.info('Updating user');
  const { id } = req.params;
  const { name, lastName, userName, email, pass, phone, address, jobName } = req.body;
  const user = await isToken(req, res);
  const newData = {name, lastName, userName, email, phone, address, jobName};
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

export const userDelete = async (req, res) => {
  logger.info('Deleting user');
  const { id } = req.params;
  const user = await isToken(req, res);
  handleResponse(res, User.findByIdAndUpdate(user._id, { status: false }, { new: true }));
};