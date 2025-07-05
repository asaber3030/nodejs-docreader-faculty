// import { NextFunction, Request, Response } from 'express';
// import { unauthorized } from '../utils/responses';
// import { extractToken } from '../utils/helpers';

// import { User as TUser } from '@prisma/client';

// import jwt from 'jsonwebtoken';

// import AuthController from '../controllers/AuthController';
// import UserModel from '../models/User';

// export async function checkIsAuthenticated(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   const token = extractToken(req.headers.authorization!);
//   if (!token) return unauthorized(res);

//   try {
//     const verifiedToken = jwt.verify(
//       token,
//       AuthController.JWT_SECRET!,
//     ) as TUser;
//     const findUser = await UserModel.find(verifiedToken.id);

//     if (!findUser) return unauthorized(res);

//     next();
//   } catch (err: any) {
//     return unauthorized(res, err?.message ? 'Invalid JWT' : 'Unauthorized');
//   }
// }
