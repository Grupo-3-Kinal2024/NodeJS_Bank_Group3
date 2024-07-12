import { Router } from "express";
import { check } from "express-validator";
import {
  validateEmail,
  validateExistentEmail,
  validateExistentPhone,
  validateExistentUserName,
  validateUser,
} from "../../helpers/data-methods.js";
import { validateFields } from "../../middlewares/validate-fields.js";
import { getAllUsers, userDelete, userPut, getEnterpriseUsers, getAllUsersWithAccounts, getAllUsersWithAccountsById, userEdit } from "./user.controller.js";

const router = Router();

router.put(
  "/",
  [
    validateFields,
  ],
  userPut
);

router.put(
  "/:id",
  [
    check("id", "Id is required").isMongoId(),
    check("id").custom(validateUser),
    validateFields,
  ],
  userEdit
);

router.get("/", getAllUsersWithAccounts);

router.get("/my-accounts", getAllUsersWithAccountsById);

router.get("/enterprise", getEnterpriseUsers);



router.delete(
  "/:id",
  [
    check("id", "Id is required").isMongoId(),
    check("id").custom(validateUser),
    validateFields,
  ],
  userDelete
);

export default router;
