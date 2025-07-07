import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import SubjectController from '../controllers/SubjectController';

const router = Router({ mergeParams: true });

router.use(AuthController.protect);
router
  .route('/')
  .get(
    AuthController.requirePermissions('subject:view'),
    SubjectController.getAllSubjects,
  )
  .post(
    AuthController.requirePermissions('subject:create'),
    SubjectController.createSubject,
  );

router
  .route('/:id')
  .get(
    AuthController.requirePermissions('subject:view'),
    SubjectController.getSubject,
  )
  .patch(
    AuthController.requirePermissions('subject:update'),
    SubjectController.updateSubject,
  )
  .delete(
    AuthController.requirePermissions('subject:delete'),
    SubjectController.deleteSubject,
  );

export default router;
