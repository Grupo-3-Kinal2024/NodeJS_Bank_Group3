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
import { getAllUsers, userPut, getEnterpriseUsers } from "./user.controller.js";

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

router.get("/", getAllUsers);
router.get("/enterprise", getEnterpriseUsers);

export default router;
