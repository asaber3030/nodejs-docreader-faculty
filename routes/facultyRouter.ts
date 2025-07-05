import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import FacultyController from '../controllers/FacultyController';

const router = Router();

router.use(AuthController.protect);

router.get(
  '/',
  AuthController.requirePermissions('faculty:view'),
  FacultyController.getAllFaculties,
);

router
  .route('/:id')
  .get(
    AuthController.requirePermissions('faculty:view'),
    FacultyController.getFaculty,
  );

export default router;
