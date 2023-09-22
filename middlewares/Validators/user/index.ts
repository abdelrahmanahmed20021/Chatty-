import bcrypt from "bcrypt";
import Express from "express";
import validator from "validator";

import prisma from "../../../db";

export const checkExistUser = async (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {
  const email = await prisma.user.findUnique({
    where: { email: req.body.email },
  });

  if (email) {
    res.status(400).json({
      status: 400,
      message: "This User Existed !",
    });
    return;
  }
  next();
};

export const checkNotExistUser = async (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {
  const email = await prisma.user.findUnique({
    where: { email: req.body.email },
  });

  if (!email) {
    res.status(400).json({
      status: 400,
      message: "This user not exist please signin first",
    });
    return;
  }
  const validatePassword = await bcrypt.compare(
    req.body.password,
    email!.password
  );
  if (!validatePassword) {
    res.status(400).json({
      status: 400,
      message: "Password not correct please try again",
    });
    return;
  }

  next();
};

export const signinEmailValidator = (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {
  const { email, password, name } = req.body;
  const userEmail = email && validator.isEmail(req.body.email);

  if (!email) {
    res.send_badRequest("Email is required !");
    return;
  } else if (!userEmail) {
    res.send_badRequest("Invalid Email");
    return;
  }

  if (!password) {
    res.send_badRequest("Password is required !");
    return;
  } else if (password.length < 7) {
    res.send_badRequest("Password should be more than 6 characters ");
    return;
  }

  if (!name) {
    res.send_badRequest("Name is required !");
    return;
  } else if (name.length < 3) {
    res.send_badRequest("Name should be more than 2 characters ");
    return;
  }

  next();
};

export const loginEmailValidator = (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {
  const { email, password } = req.body;
  const userEmail = email && validator.isEmail(req.body.email);

  if (!email) {
    res.send_badRequest("Email is required !");
    return;
  } else if (!userEmail) {
    res.send_badRequest("Invalid Email");
    return;
  }

  if (!password) {
    res.send_badRequest("Password is required !");
    return;
  } else if (password.length < 7) {
    res.send_badRequest("Password should be more than 6 characters ");
    return;
  }

  next();
};
