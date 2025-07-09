import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import LectureController from '../controllers/LectureController';

const router = Router();

router.use(AuthController.protect);
router
  .route('/:id')
  .get(
    AuthController.requirePermissions('lecture:view'),
    LectureController.getLecture,
  )
  .patch(
    AuthController.requirePermissions('lecture:update'),
    LectureController.updateLecture,
  )
  .delete(
    AuthController.requirePermissions('lecture:delete'),
    LectureController.deleteLecture,
  );

export default router;
