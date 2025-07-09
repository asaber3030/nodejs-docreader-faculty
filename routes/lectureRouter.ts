import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import LectureController from '../controllers/LectureController';
import QuizController from '../controllers/QuizController';

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

// Nested quiz routes

router
  .route('/:lectureId/quizzes')
  .get(
    AuthController.requirePermissions('quiz:view'),
    QuizController.getAllQuizzes,
  )
  .post(
    AuthController.requirePermissions('quiz:create'),
    QuizController.createQuiz,
  );

export default router;
