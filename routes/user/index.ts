import express, { IRouter } from 'express';

import {
  checkToken,
  getUser,
  Loginin,
  Signin,
} from '../../middlewares/controller/user';
import {
  checkExistUser,
  checkNotExistUser,
  loginEmailValidator,
  signinEmailValidator,
} from '../../middlewares/Validators/user';
import { generateToken } from '../../utils';

export const router: IRouter = express.Router();

router.post(
  "/signin",
  signinEmailValidator,
  checkExistUser,
  generateToken,
  Signin
);
router.post(
  "/login",
  loginEmailValidator,
  checkNotExistUser,
  generateToken,
  Loginin
);

router.get("/:id", checkToken, getUser);
