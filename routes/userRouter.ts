import { Router } from 'express';
import UserController from '../controllers/UserController';
import AuthController from '../controllers/AuthController';

const router = Router();

router.use(AuthController.protect);

// ME ROUTES
router.get('/me', UserController.getMe, UserController.getUser);
// router.patch('/updateMe', UserController.updateMe);
// router.delete('/deleteMe', UserController.deleteMe);

// USER ROUTES
// router.use(AuthController.restrictTo('Admin'));
// router
//   .route('/')
//   .get(UserController.getAllUsers)
//   .post(UserController.createUser);

router
  .route('/:id')
  .get(UserController.getUser)
  .patch(UserController.updateUser);
//   .delete(UserController.deleteUser);

export default router;
