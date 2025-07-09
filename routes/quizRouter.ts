import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import QuizController from '../controllers/QuizController';

const router = Router();

router.use(AuthController.protect);
router
  .route('/:id')
  .get(AuthController.requirePermissions('quiz:view'), QuizController.getQuiz)
  .patch(
    AuthController.requirePermissions('quiz:update'),
    QuizController.updateQuiz,
  )
  .delete(
    AuthController.requirePermissions('quiz:delete'),
    QuizController.deleteQuiz,
  );

export default router;
