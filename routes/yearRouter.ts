import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import YearController from '../controllers/YearController';
import ModuleController from '../controllers/ModuleController';

const router = Router();

router.use(AuthController.protect);
router
  .route('/')
  .get(
    AuthController.requirePermissions('year:view'),
    YearController.getAllYears,
  )
  .post(
    AuthController.requirePermissions('year:create'),
    YearController.createYear,
  );

router
  .route('/:id')
  .get(AuthController.requirePermissions('year:view'), YearController.getYear)
  .patch(
    AuthController.requirePermissions('year:update'),
    YearController.updateYear,
  )
  .delete(
    AuthController.requirePermissions('year:delete'),
    YearController.deleteYear,
  );

// Nested module routes
router
  .route('/:yearId/modules/')
  .get(
    AuthController.requirePermissions('module:view'),
    ModuleController.getAllModules,
  )
  .post(
    AuthController.requirePermissions('module:create'),
    ModuleController.createModule,
  );

export default router;
