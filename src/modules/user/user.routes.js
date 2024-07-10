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
import { getAllUsers, userDelete, userPut, getEnterpriseUsers, getAllUsersWithAccounts} from "./user.controller.js";

const router = Router();

router.put(
  "/:id",
  [
    check("userName").custom(validateExistentUserName),
    check("email").custom(validateEmail),
    check("email").custom(validateExistentEmail),
    check("phone").custom(validateExistentPhone),
    validateFields,
  ],
  userPut
);

router.get("/", getAllUsersWithAccounts);

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
