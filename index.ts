import 'dotenv/config';

import dotenv from 'dotenv';
import express, { Express } from 'express';
import morgan from 'morgan';
import responser from 'responser';

import { router as UserRoutes } from './routes/user/index';
import { router as UsersRoutes } from './routes/users/index';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use(responser);

app.use(morgan("dev"));

app.use("/api/user", UserRoutes);

app.use("/api/users", UsersRoutes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
