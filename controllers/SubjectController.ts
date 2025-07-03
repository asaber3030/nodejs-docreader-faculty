// import { Request, Response } from 'express';
// import { UserRole } from '@prisma/client';

// import { subjectLecture, subjectSchema } from '../schema';
// import {
//   badRequest,
//   notFound,
//   send,
//   unauthorized,
//   validationErrors,
// } from '../utils/responses';
// import { currentDate, extractErrors, parameterExists } from '../utils/helpers';

// import db, {
//   findLectureMany,
//   findLectureUnique,
//   findSubjectUnique,
//   SUBJECT_ORDER_BY,
//   SUBJECT_INCLUDE,
//   findSubjectMany,
// } from '../utils/db';
// import AuthController from './AuthController';

// export default class SubjectController {
//   async getAllSubjects(req: Request, res: Response) {
//     try {
//       const subjects = await findSubjectMany();
//       return send(res, 'Subjects', 200, subjects);
//     } catch (errorObject) {
//       return res.status(500).json({
//         errorObject,
//         message: 'Error - Something Went Wrong.',
//         status: 500,
//       });
//     }
//   }

//   async get(req: Request, res: Response) {
//     try {
//       const subjectId = parameterExists(req, res, 'subjectId');
//       if (!subjectId) return badRequest(res, 'Invalid subjectId');

//       const subject = await findSubjectUnique({ id: subjectId });
//       if (!subject) return notFound(res, "Subject doesn't exist.");

//       return res.status(200).json({
//         data: subject,
//         message: `subjectId [${subjectId}] - Data`,
//         status: 200,
//       });
//     } catch (errorObject) {
//       return res.status(500).json({
//         errorObject,
//         message: 'Error - Something Went Wrong.',
//         status: 500,
//       });
//     }
//   }

//   async getLectures(req: Request, res: Response) {
//     try {
//       const subjectId = parameterExists(req, res, 'subjectId');
//       if (!subjectId) return badRequest(res, 'Invalid subjectId');

//       const findSubject = await db.subject.findUnique({
//         where: { id: subjectId },
//         select: { id: true, moduleId: true },
//       });
//       if (!findSubject) return notFound(res, "Subject doesn't exist.");

//       const lectures = await findLectureMany({ subject: { id: subjectId } });

//       return res.status(200).json({
//         data: lectures,
//         message: `subjectId [${subjectId}] - Lectures Data`,
//         status: 200,
//       });
//     } catch (errorObject) {
//       return res.status(500).json({
//         errorObject,
//         message: 'Error - Something Went Wrong.',
//         status: 500,
//       });
//     }
//   }

//   async updateSubject(req: Request, res: Response) {
//     try {
//       const user = await AuthController.user(req, res);
//       if (user?.role !== UserRole.Admin)
//         return unauthorized(res, 'Unauthorized - Admin Role Required.');

//       const subjectId = parameterExists(req, res, 'subjectId');
//       if (!subjectId) return badRequest(res, 'Invalid subjectId');

//       const subject = await db.subject.findUnique({ where: { id: subjectId } });
//       if (!subject) return notFound(res, "Subject doesn't exist.");

//       const findModule = await db.module.findUnique({
//         where: { id: subject.moduleId },
//       });
//       if (findModule?.yearId !== user?.yearId) return unauthorized(res);

//       const parsedBody = subjectSchema.update.safeParse(req.body);
//       if (!parsedBody.success)
//         return send(res, 'Validation errors', 400, extractErrors(parsedBody));

//       const updatedSubject = await db.subject.update({
//         where: { id: subjectId },
//         data: parsedBody.data,
//       });

//       return send(res, 'Subject has been updated', 200, updatedSubject);
//     } catch (errorObject) {
//       return res.status(500).json({
//         errorObject,
//         message: 'Error - Something Went Wrong.',
//         status: 500,
//       });
//     }
//   }

//   async deleteSubject(req: Request, res: Response) {
//     try {
//       const user = await AuthController.user(req, res);
//       if (user?.role !== UserRole.Admin)
//         return unauthorized(res, 'Unauthorized - Admin Role Required.');

//       const subjectId = parameterExists(req, res, 'subjectId');
//       if (!subjectId) return badRequest(res, 'Invalid subjectId');

//       const subject = await findSubjectUnique({ id: subjectId });
//       if (!subject) return notFound(res, "Subject doesn't exist.");

//       const findModule = await db.module.findUnique({
//         where: { id: subject.moduleId },
//       });
//       if (findModule?.yearId !== user?.yearId) return unauthorized(res);

//       await db.subject.delete({ where: { id: subjectId } });
//       return send(res, 'Subject has been deleted', 200, subject);
//     } catch (errorObject) {
//       return res.status(500).json({
//         errorObject,
//         message: 'Error - Something Went Wrong.',
//         status: 500,
//       });
//     }
//   }

//   async createLecture(req: Request, res: Response) {
//     try {
//       const body = subjectLecture.create.safeParse(req.body);
//       if (!body.success) return validationErrors(res, extractErrors(body));

//       const data = body.data;

//       const user = await AuthController.user(req, res);
//       if (!user || user?.role !== UserRole.Admin)
//         return unauthorized(res, 'Unauthorized - Admin Role Required.');

//       const subjectId = parameterExists(req, res, 'subjectId');
//       if (!subjectId) return badRequest(res, 'Invalid subjectId');

//       const subject = await db.subject.findUnique({ where: { id: subjectId } });
//       if (!subject) return notFound(res, "Subject doesn't exist.");

//       const findModule = await db.module.findUnique({
//         where: { id: subject.moduleId },
//       });
//       if (findModule?.yearId !== user?.yearId) return unauthorized(res);

//       const { id: lectureId } = await db.lecture.create({
//         data: {
//           ...data,
//           subjectId,
//           subTitle: data.subTitle ?? '',
//           createdAt: currentDate(),
//         },
//       });
//       const newLecture = await findLectureUnique({ id: lectureId });

//       return send(res, 'Lecture has been created.', 201, newLecture);
//     } catch (errorObject) {
//       return res.status(500).json({
//         errorObject,
//         message: 'Error - Something Went Wrong.',
//         status: 500,
//       });
//     }
//   }
// }
