import Express from "express";

import prisma from "../../../db";

export const getUsers = async (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {
  const users = await prisma.user.findMany({
    select: { password: false, id: true, email: true, name: true },
  });
  if (users.length) {
    res.send_accepted("user", users);
    return;
  }

  res.send_notFound("No users matched", null);
};
