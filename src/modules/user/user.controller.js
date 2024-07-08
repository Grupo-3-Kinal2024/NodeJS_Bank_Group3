import bcryptjs from "bcryptjs";
import User from "./user.model.js";
import { validateUserRequest } from "../../helpers/controller-checks.js"
import { handleResponse } from "../../helpers/handle-resp.js"
import { logger } from "../../helpers/logger.js";

/**************  PUT *****************/
export const userPut = async (req, res) => {
  const { id } = req.params;
  const { name, lastName, userName, email, pass, phone, address, jobName } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Update user properties
    user.name = name || user.name;
    user.lastName = lastName || user.lastName;
    user.userName = userName || user.userName;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.jobName = jobName || user.jobName;

    if (pass) {
      // Check if password changed
      if (pass !== user.pass) {
        const hashedPass = bcryptjs.hashSync(pass, 10);
        user.pass = hashedPass;
      }
    }

    // Save the updated user
    await user.save();

    const userDetails = {
      id: user._id,
      DPI: user.DPI,
      name: user.name,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
      pass: pass || undefined, // Include unhashed password if provided
      phone: user.phone,
      address: user.address,
      jobName: user.jobName,
      role: user.role,
      status: user.status,
      accounts: user.accounts,
    };

    // Send the response
    res.status(200).json({
      msg: "User profile updated successfully",
      userDetails: userDetails,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send("Please contact the administrator/support.");
  }
};

/**************  Get a User *****************/

export const getAllUsers = async (req, res) => {
  try {
    const user = await User.find({ status: true });
    res.status(200).send(user);
  } catch (e) {
    console.log(e);
    res.status(500).send("Please contact the administrator/support.");
  }
};

/**************  Delete A User *****************/

export const userDelete = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    user.status = false;
    await user.save();

    res.status(200).send(`User deleted successfully ${user}`);
  } catch (e) {
    console.log(e);
    res.status(500).send("Please contact the administrator/support.");
  }
};
