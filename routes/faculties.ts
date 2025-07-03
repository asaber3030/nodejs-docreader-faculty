import { Router } from 'express';

// import FacultyController from '../controllers/FacultyController';
// import { checkIsAdmin } from '../middlewares/isAdmin';

const facultyRouter = Router();
// const controller = new FacultyController();

// facultyRouter.get('/faculties', controller.get);
// facultyRouter.get('/faculties/:facultyId/years', controller.getFacultyYears);
// facultyRouter.get('/faculties/:facultyId', controller.getFaculty);

// facultyRouter.post('/faculties/create', checkIsAdmin, controller.createFaculty);
// facultyRouter.post(
//   '/faculties/:facultyId/update',
//   checkIsAdmin,
//   controller.updateFaculty,
// );
// facultyRouter.delete(
//   '/faculties/:facultyId/delete',
//   checkIsAdmin,
//   controller.deleteFaculty,
// );

// facultyRouter.post(
//   '/faculties/:facultyId/years/create',
//   checkIsAdmin,
//   controller.createYear,
// );
// facultyRouter.get('/faculties/:facultyId/years/:yearId', controller.getYear);
// facultyRouter.get(
//   '/faculties/:facultyId/years/:yearId/students',
//   checkIsAdmin,
//   controller.getYearStudents,
// );
// facultyRouter.post(
//   '/faculties/:facultyId/years/:yearId/update',
//   checkIsAdmin,
//   controller.updateYear,
// );
// facultyRouter.delete(
//   '/faculties/:facultyId/years/:yearId/delete',
//   checkIsAdmin,
//   controller.deleteYear,
// );

export default facultyRouter;
