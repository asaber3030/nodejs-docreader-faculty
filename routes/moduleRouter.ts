import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import ModuleController from '../controllers/ModuleController';
import subjectRouter from '../routes/subjectRouter';

const router = Router();

router.use('/:moduleId/subjects', subjectRouter);

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

export default router;
