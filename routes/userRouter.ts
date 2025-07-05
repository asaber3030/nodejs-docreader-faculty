import { Router } from 'express';
import UserController from '../controllers/UserController';
import AuthController from '../controllers/AuthController';
import { Auth } from 'firebase-admin/lib/auth/auth';

const router = Router();

router.use(AuthController.protect);

// ME ROUTES
router.get('/me', UserController.getMe, UserController.getUser);
router.patch(
  '/updateMe',
  AuthController.requirePermissions('user:update_self'),
  UserController.getMe,
  UserController.updateUser,
);
router.delete('/deleteMe', UserController.getMe, UserController.deleteUser); // Deletion doesn't require a permission to not lock the user in the app

// USER ROUTES
router
  .route('/')
  .get(
    AuthController.requirePermissions('user:view'),
    UserController.getAllUsers,
  );

router
  .route('/:id')
  .get(AuthController.requirePermissions('user:view'), UserController.getUser)
  .patch(
    AuthController.requirePermissions('user:update_any'),
    UserController.updateUser,
  )
  .delete(
    AuthController.requirePermissions('user:delete_any'),
    UserController.deleteUser,
  );

router
  .route('/:id/assignRole')
  .patch(
    AuthController.requirePermissions('user:assign_role'),
    UserController.assignRole,
  );

export default router;
