import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import FacultyController from '../controllers/FacultyController';

const router = Router();

router.use(AuthController.protect);
router
  .route('/')
  .get(
    AuthController.requirePermissions('faculty:view'),
    FacultyController.getAllFaculties,
  )
  .post(
    AuthController.requirePermissions('faculty:create'),
    FacultyController.createFaculty,
  );

router
  .route('/:id')
  .get(
    AuthController.requirePermissions('faculty:view'),
    FacultyController.getFaculty,
  )
  .patch(
    AuthController.requirePermissions('faculty:update'),
    FacultyController.updateFaculty,
  )
  .delete(
    AuthController.requirePermissions('faculty:delete'),
    FacultyController.deleteFaculty,
  );

export default router;
