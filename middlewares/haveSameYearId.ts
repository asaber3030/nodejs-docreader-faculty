import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { extractToken, parameterExists } from "../utlis/helpers";
import { badRequest, unauthorized } from "../utlis/responses";
import User from "../http/models/User";

// MUST BE RUN AFTER isAuthenticated
export async function checkHaveSameYearId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const yearId = parameterExists(req, res, "yearId");
  if (!yearId) return badRequest(res, "Invalid yearId");

  const tokenPayload = jwt.decode(
    extractToken(req.headers.authorization!)
  ) as any;
  const user = (await User.find(tokenPayload.id)!) as any;

  if (user.yearId !== +yearId) return unauthorized(res, "Unauthorized");

  next();
}
