import { Router } from 'express';

import AuthController from '../controllers/AuthController';

const router = Router();

// authRouter.post('/create-admin', authController.createAdmin);
router.post('/continueWithGoogle', AuthController.continueWithGoogle);
router.get(
  '/googleCallback',
  AuthController.extractOAuth2Tokens,
  AuthController.extractAndVerifyGoogleJWT,
  AuthController.createOrFetchUser,
);

// authRouter.get('/is-authenticated', authController.isAuthenticated);
// authRouter.get('/user', checkIsAuthenticated, authController.getUserData);

export default router;
