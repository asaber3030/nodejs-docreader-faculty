import { NextFunction, Request, Response } from 'express';

import UserModel from '../models/User';
import { Credentials, OAuth2Client, TokenPayload } from 'google-auth-library';
import AppError, { ErrorStatus } from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import JWTService from '../utils/JWTService';

declare global {
  namespace Express {
    interface Request {
      oauthJwtPayload: TokenPayload;
      oauthTokens: Credentials;
    }
  }
}

export default class AuthController {
  private static GOOGLE_CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID!;
  private static GOOGLE_CLIENT_SECRET: string =
    process.env.GOOGLE_CLIENT_SECRET!;
  private static GOOGLE_REDIRECT_URI: string = process.env.GOOGLE_REDIRECT_URI!;

  private static oauth2Client: OAuth2Client = new OAuth2Client({
    client_id: this.GOOGLE_CLIENT_ID,
    client_secret: this.GOOGLE_CLIENT_SECRET,
    redirectUri: this.GOOGLE_REDIRECT_URI,
  });

  public static signup = catchAsync(async function (
    req: Request,
    res: Response,
  ) {
    const authUrl = AuthController.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email', 'openid'],
      prompt: 'consent', // Always ask for consent to get refresh_token
    });

    res.redirect(authUrl);
  });

  public static finishOAuth2Flow = async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const authCode: string = String(req.query.code);

    if (!authCode)
      return next(
        new AppError(
          'Invalid authorization code obtained from Google authorization server.',
          ErrorStatus.error,
        ),
      );

    // Exchange auth code for tokens
    const { tokens } = await AuthController.oauth2Client.getToken(authCode);
    AuthController.oauth2Client.setCredentials(tokens);

    if (!tokens.access_token)
      return next(
        new AppError(
          'Invalid access token received from Google authorization server.',
          500,
        ),
      );

    if (!tokens.refresh_token)
      return next(
        new AppError(
          'Invalid refresh token received from Google authorization server.',
          500,
        ),
      );

    // Write tokens to disk
    // fs.writeFileSync('../access_token', tokens.access_token);
    // fs.writeFileSync('../refresh_token', tokens.refresh_token);

    // Verify ID token (JWT) and get user info
    const ticket = await AuthController.oauth2Client.verifyIdToken({
      idToken: String(tokens.id_token),
      audience: AuthController.GOOGLE_CLIENT_ID,
    });

    const jwtPayload = ticket.getPayload();

    if (!jwtPayload)
      throw new AppError(
        'Invalid JWT received from Google authorization server.',
        500,
      );

    req.oauthJwtPayload = jwtPayload;
    req.oauthTokens = tokens;
    next();
  };

  public static createUser = catchAsync(async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const jwtPayload = req.oauthJwtPayload;
    const tokens = req.oauthTokens;

    const user = await UserModel.create({
      googleSubId: jwtPayload.sub,
      givenName: jwtPayload.given_name || '',
      familyName: jwtPayload.family_name || '',
      email: jwtPayload.email || '',
      picture: jwtPayload.picture || '',
      role: 'User',
      status: false,
    });

    console.log(user);

    JWTService.createAndSendJWT(user.id, user.role, res, 201, {});
  });
}
