import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import ModuleController from '../controllers/ModuleController';
import SubjectController from '../controllers/SubjectController';

const router = Router();

router.use(AuthController.protect);
router
  .route('/')
  .get(
    AuthController.requirePermissions('module:view'),
    ModuleController.getAllModules,
  )
  .post(
    AuthController.requirePermissions('module:create'),
    ModuleController.createModule,
  );

router
  .route('/:id')
  .get(
    AuthController.requirePermissions('module:view'),
    ModuleController.getModule,
  )
  .patch(
    AuthController.requirePermissions('module:update'),
    ModuleController.updateModule,
  )
  .delete(
    AuthController.requirePermissions('module:delete'),
    ModuleController.deleteModule,
  );

// Nested Subject Routes
router
  .route('/:moduleId/subjects')
  .get(
    AuthController.requirePermissions('subject:view'),
    SubjectController.getAllSubjects,
  )
  .post(
    AuthController.requirePermissions('subject:create'),
    SubjectController.createSubject,
  );

export default router;
