import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import SubjectController from '../controllers/SubjectController';

const router = Router({ mergeParams: true });

router.use(AuthController.protect);

router
  .route('/:id')
  .get(
    AuthController.requirePermissions('subject:view'),
    SubjectController.getSubject,
  )
  .patch(
    AuthController.requirePermissions('subject:update_any'),
    SubjectController.updateSubject,
  )
  .delete(
    AuthController.requirePermissions('subject:delete_any'),
    SubjectController.deleteSubject,
  );

export default router;
