import bcrypt from "bcrypt";
import Express from "express";
import jwt from "jsonwebtoken";
import validator from "validator";

import prisma from "../../../db";

export const Signin = async (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {
  const body = req.body;

  const hashPassword = await bcrypt.hash(body.password, 10);

  const { password, ...user } = await prisma.user.create({
    data: {
      ...body,
      password: hashPassword,
      token: body.token,
    },
  });
  res.cookie(
    "token",
    {
      token: req.body.token,
      data: {
        email: body.email,
        name: body.name,
      },
    },
    {
      httpOnly: true,
      maxAge: 24 * 60 * 60,
    }
  );
  res.send_created("Email created  successfully", user);
};

export const Loginin = async (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {
  const { password, ...user } = await prisma.user.update({
    where: {
      email: req.body.email,
    },
    data: {
      token: req.body.token,
    },
  });

  res.cookie(
    "token",
    {
      token: req.body.token,
      data: {
        email: user.email,
        name: user.name,
      },
    },
    {
      httpOnly: true,
      maxAge: 24 * 60 * 60,
    }
  );
  res.send_accepted("Login in done successfully", user);
};

export const checkToken = async (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  const key = process.env.JWT_SECRET;

  if (!token) {
    res.send_badRequest("Please insert token", null);
    return;
  }

  if (!key) {
    res.send_internalServerError("Server Error", null);
    return;
  }

  try {
    jwt.verify(token, key);
    next();
  } catch (e) {
    res.send_badRequest("Invalid Token", null);
  }
};

export const getUser = async (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {
  const { id } = req.params;

  if (!id) {
    res.send_badGateway("Id is required");
    return;
  } else if (!validator.isMongoId(id)) {
    res.send_badGateway("Invalid ID");
    return;
  }
  const user = await prisma.user.findMany({
    where: { id },
    select: { id: true, email: true, name: true, password: false },
  });
  if (user.length) {
    res.send_accepted("user", user);
    return;
  }

  res.send_notFound("No user match this ID", null);
};
