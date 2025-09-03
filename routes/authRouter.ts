import { Router } from 'express';

import AuthController from '../controllers/AuthController';

const router = Router();

router.post('/getGoogleAuthURL', AuthController.continueWithGoogle);
router.get(
  '/googleCallback',
  AuthController.extractOAuth2Tokens,
  AuthController.extractAndVerifyGoogleJWT,
  AuthController.createOrFetchUser,
);

router.post(
  '/continueWithGoogle',
  AuthController.extractAndVerifyGoogleJWT,
  AuthController.createOrFetchUser,
);

router.post('/logout', AuthController.logout); // removed protect to hanldle logout for deleted users

export default router;
