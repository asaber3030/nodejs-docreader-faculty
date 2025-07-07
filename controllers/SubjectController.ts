import catchAsync from '../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import SubjectModel from '../models/Subject';
import AppError from '../utils/AppError';

export default class SubjectController {
  private static checkAndExtractIDs(
    req: Request,
    next: NextFunction,
  ): { id: number | undefined; moduleId: number } {
    // This will always exist as the route is a nested route
    const moduleId = Number.parseInt(req.params.moduleId);

    if (Number.isNaN(moduleId))
      return next(
        new AppError('Invalid module ID: module ID must be an integer.', 400),
      );

    let id = undefined;

    if (req.params.id !== undefined) {
      id = Number.parseInt(req.params.id);

      if (Number.isNaN(id))
        return next(
          new AppError(
            'Invalid subject ID: subject ID must be an integer.',
            400,
          ),
        );
    }

    return { id, moduleId };
  }

  public static createSubject = catchAsync(async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { moduleId } = SubjectController.checkAndExtractIDs(req, next);

    req.body.moduleId = moduleId;

    const subject = await SubjectModel.createOne(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        subject,
      },
    });
  });

  public static getAllSubjects = catchAsync(async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { moduleId } = SubjectController.checkAndExtractIDs(req, next);

    const subjects = await SubjectModel.findMany({
      where: {
        moduleId,
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        subjects,
      },
    });
  });

  public static getSubject = catchAsync(async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { id } = SubjectController.checkAndExtractIDs(req, next);

    const subject = await SubjectModel.findOneById(id!);

    res.status(200).json({
      status: 'success',
      data: {
        subject,
      },
    });
  });

  public static updateSubject = catchAsync(async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { id } = SubjectController.checkAndExtractIDs(req, next);

    const updatedSubject = await SubjectModel.updateOne(id!, req.body);

    res.status(200).json({
      status: 'success',
      data: {
        subject: updatedSubject,
      },
    });
  });

  public static deleteSubject = catchAsync(async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { id } = SubjectController.checkAndExtractIDs(req, next);

    await SubjectModel.deleteOne(id!);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
}
