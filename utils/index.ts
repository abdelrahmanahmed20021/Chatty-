import Express from "express";
import jwt from "jsonwebtoken";

export const generateToken = async (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {
  const body = req.body;
  const token = jwt.sign(
    { email: body.email, name: body.name },
    process.env.JWT_SECRET!,
    {
      algorithm: "HS256",
      expiresIn: "1d",
    }
  );
  req.body.token = token;
  next();
};
