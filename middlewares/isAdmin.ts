import { NextFunction, Request, Response } from 'express';
import { User as TUser } from '@prisma/client';
import jwt from 'jsonwebtoken';

import db from '../utils/db';
import { unauthorized } from '../utils/responses';
import { extractToken } from '../utils/helpers';
import AuthController from '../http/controllers/AuthController';

export async function checkIsAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = extractToken(req.headers.authorization!);
  if (!token) return unauthorized(res);

  try {
    const verifiedToken = jwt.verify(token, AuthController.secret!) as TUser;
    const user = await db.user.findFirst({ where: { id: verifiedToken.id } });

    if (!user) return unauthorized(res);

    if (user.role !== 'Admin') return unauthorized(res, 'Not admin');

    next();
  } catch (err: any) {
    return unauthorized(res, err?.message ? 'Invalid JWT' : 'Unauthorized');
  }
}
