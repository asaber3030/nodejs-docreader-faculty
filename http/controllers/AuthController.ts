import { Request, Response } from 'express';

import {
  badRequest,
  notFound,
  send,
  unauthorized,
} from '../../utils/responses';
import { currentDate, extractErrors, extractToken } from '../../utils/helpers';
import { userSchema } from '../../schema/user.schema';

import { User as TUser, UserRole } from '@prisma/client';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../../prisma/db';

import User from '../models/User';
import Faculty from '../models/Faculty';

import { OAuth2Client } from 'google-auth-library';

export default class AuthController {
  private static JWT_SECRET: string = process.env.APP_USER_SECRET!;

  private static GOOGLE_CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID!;
  private static GOOGLE_CLIENT_SECRET: string =
    process.env.GOOGLE_CLIENT_SECRET!;
  private static GOOGLE_REDIRECT_URI: string = process.env.GOOGLE_REDIRECT_URI!;

  private static oauth2Client: OAuth2Client = new OAuth2Client({
    client_id: this.GOOGLE_CLIENT_ID,
    client_secret: this.GOOGLE_CLIENT_SECRET,
    redirectUri: this.GOOGLE_REDIRECT_URI,
  });

  async signup(req: Request, res: Response) {
    const authUrl = AuthController.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email', 'openid'],
      prompt: 'consent', // Always ask for consent to get refresh_token
    });

    res.redirect(authUrl);
  }

  async extractTokens(req: Request, res: Response) {
    const code: string = String(req.query.code);

    if (!code) {
      return res.status(400).send('Missing auth code.');
    }

    try {
      // Step 3: Exchange code for tokens
      const { tokens } = await AuthController.oauth2Client.getToken(code);
      AuthController.oauth2Client.setCredentials(tokens);

      // Step 4: Verify ID token (JWT) and get user info
      const ticket = await AuthController.oauth2Client.verifyIdToken({
        idToken: String(tokens.id_token),
        audience: AuthController.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (!payload) throw new Error('Invalid JWT obtained from google server.');
      User.signup({
        id: Number.parseInt(payload.sub),
        givenName: payload.given_name,
        familyName: payload.family_name,
        email: payload.email,
        picture: payload.picture,
      });

      res.status(200).json({
        status: 'success',
        jwt: ticket,
      });
    } catch (error) {
      console.error('Error verifying Google login:', error);
      res.status(500).send('Authentication failed.');
    }
  }

  async isAuthenticated(req: Request, res: Response) {
    const token = extractToken(req.headers.authorization!);
    try {
      const userData = jwt.verify(token, AuthController.JWT_SECRET) as TUser;
      if (!userData) return badRequest(res, 'Invalid token.');
      const findUser = await User.find(userData.id);
      if (!findUser)
        return res.status(200).json({
          message: 'Authorized',
          status: 402,
          data: {
            authorized: false,
          },
        });
    } catch (error) {
      return res.status(401).json({
        message: 'Unauthorized',
        status: 401,
        data: {
          authorized: false,
        },
      });
    }
    return res.status(200).json({
      message: 'Authorized',
      status: 200,
      data: {
        authorized: true,
      },
    });
  }

  static async user(req: Request, res: Response) {
    const token = extractToken(req.headers.authorization!);
    try {
      const userData = jwt.verify(token, AuthController.JWT_SECRET) as TUser;
      const user = await db.user.findUnique({
        where: { id: userData?.id },
        select: User.dbSelectors,
      });
      return user;
    } catch (error) {
      return null;
    }
  }

  async getUserData(req: Request, res: Response) {
    const token = extractToken(req.headers.authorization!);
    try {
      const tokenData = jwt.verify(token, AuthController.JWT_SECRET) as TUser;
      const user = await db.user.findUnique({
        where: { id: tokenData?.id },
        include: {
          faculty: true,
          year: true,
          markedQuestions: { include: { question: true } },
        },
      });
      if (!user) return unauthorized(res, "User doesn't exist. Unauthorized");

      const { password, markedQuestions, ...mainUser } = user;
      return send(res, 'User data', 200, {
        ...mainUser,
        markedQuestions: markedQuestions.map(mq => mq.question),
      });
    } catch (error) {
      return unauthorized(res, "User doesn't exist. Unauthorized");
    }
  }

  async createAdmin(req: Request, res: Response) {
    try {
      const body = userSchema.createAdmin.safeParse(req.body);
      const data = body.data;

      if (!body.success) {
        const errors = extractErrors(body);
        return res.status(400).json({
          errors,
          message: 'Form validation errors.',
          status: 400,
        });
      }

      if (!data) {
        return res.status(400).json({
          message: "Please check there's valid JSON data in the request body.",
          status: 400,
        });
      }

      const userByEmail = await User.findBy(data.email);
      if (userByEmail) {
        return res.status(409).json({
          message: 'E-mail Already exists.',
          status: 409,
        });
      }

      const findFaculty = await Faculty.find(data.facultyId);
      if (!findFaculty)
        return notFound(
          res,
          "Faculty doesn't exist with provided Id: " + data.facultyId,
        );

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const { confirmationPassword, ...restData } = data;

      if (data.passcode !== process.env.PASSCODE) {
        return unauthorized(res, 'Invalid Passcode.');
      }

      const newUser = await db.user.create({
        data: {
          name: restData.name,
          email: restData.email,
          yearId: restData.yearId,
          facultyId: restData.facultyId,
          password: hashedPassword,
          status: true,
          role: UserRole.Admin,
          createdAt: currentDate(),
        },
      });

      const { password, ...mainUser } = newUser;
      const token = jwt.sign(mainUser, AuthController.JWT_SECRET!);

      return res.status(201).json({
        message: 'Admin Registered successfully',
        status: 201,
        data: {
          user: mainUser,
          token,
        },
      });
    } catch (errorObject) {
      return res.status(500).json({
        message: 'Error',
        status: 500,
        errorObject,
      });
    }
  }
}
