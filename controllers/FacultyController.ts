import catchAsync from '../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import FacultyModel from '../models/Faculty';
export default class FacultyController {
  public static getAllFaculties = catchAsync(async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const faculties = await FacultyModel.findMany({});

    res.status(200).json({
      status: 'success',
      data: {
        faculties,
      },
    });
  });

  public static getFaculty = catchAsync(async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const id = Number.parseInt(req.params.id);

    const faculty = await FacultyModel.findOneById(id);

    res.status(200).json({
      status: 'success',
      data: {
        faculty,
      },
    });
  });

  public static updateFaculty = catchAsync(async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const id = Number.parseInt(req.params.id);

    const updatedFaculty = await FacultyModel.updateOne(id, req.body);

    res.status(200).json({
      status: 'success',
      data: {
        faculty: updatedFaculty,
      },
    });
  });
}
