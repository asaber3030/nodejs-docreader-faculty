import { Router } from 'express';

import EventController from '../controllers/EventController';
import AuthController from '../controllers/AuthController';

const router = Router();

router.use(AuthController.protect);
router.route('/bulk').post(EventController.bulk);

export default router;
