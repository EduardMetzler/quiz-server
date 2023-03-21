import express from "express";
import {
  registerValidationRules,
  validate
} from "../middlewares/userValidation.js";

import { login, register } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerValidationRules, validate, register);

router.post("/login", login);

export default router;
