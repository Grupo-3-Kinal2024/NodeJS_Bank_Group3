import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validate-fields.js";
import { login, register } from "./auth.controller.js";
import { validateExistentUserName ,validateExistentDPI ,validateExistentPhone ,validateEmail ,  validateExistentEmail, validateUser } from "../helpers/data-methods.js";


const router = Router();

router.post(
    "/login",
    [
        check("email", "Email is required").isEmail(),
        check("pass", "Password is required").not().isEmpty(),
        validateFields,
    ],
    login
);

router.post(
    '/register',
    [
        check("DPI", "DPI is required").not().isEmpty(),
        check("DPI").custom(validateExistentDPI),
        check("name", "Name is required").not().isEmpty(),
        check("lastName", "Last Name is required").not().isEmpty(),
        check("userName", "Username is required").not().isEmpty(),
        check("userName").custom(validateExistentUserName),
        check("email").custom(validateEmail),
        check("email").custom(validateExistentEmail),
        check("pass", "Password is required").not().isEmpty(),
        check("phone", "Phone number is required").not().isEmpty(),
        check("phone").custom(validateExistentPhone),
        check("address", "Address is required").not().isEmpty(),
        check("jobName", "Job name is required").not().isEmpty(),  
        validateFields,
    ],
    register
  );



export default router;