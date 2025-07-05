import { Router } from 'express';
import AuthController from '../controllers/AuthController';

const router = Router();

router.use(AuthController.protect);

export default router;
