import { Router } from 'express';

import AuthController from '../controllers/AuthController';

const router = Router();

// authRouter.post('/create-admin', authController.createAdmin);
router.post('/login', AuthController.continueWithGoogle);
router.get(
  '/login/callback',
  AuthController.extractOAuth2Tokens,
  AuthController.extractAndVerifyGoogleJWT,
  AuthController.createUser,
);

// authRouter.get('/is-authenticated', authController.isAuthenticated);
// authRouter.get('/user', checkIsAuthenticated, authController.getUserData);

export default router;
