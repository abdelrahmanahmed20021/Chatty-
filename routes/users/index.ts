import express, { IRouter } from 'express';

import { checkToken } from '../../middlewares/controller/user';
import { getUsers } from '../../middlewares/controller/users';

export const router: IRouter = express.Router();

router.route("/").get(checkToken, getUsers);
