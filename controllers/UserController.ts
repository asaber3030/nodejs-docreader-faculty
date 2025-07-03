import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import UserModel from '../models/User';
import { userSchemaUpdate } from '../schema/user.schema';

export default class UserController {
  public static getMe = catchAsync(async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    req.params.id = req.user.id;

    next();
  });

  public static getUser = catchAsync(async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const id = Number(req.params.id);
    const user = await UserModel.findById(id);

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  });

  public static updateUser = catchAsync(async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const id = Number(req.params.id);

    const updatedUser = await UserModel.update(id, req.body);

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  });
}

/**
 * try {
      const body = userSchema.update.safeParse(req.body);
      const user = await UserController.user(req);
      if (!user) return unauthorized(res);
      if (!body.success)
        return send(res, 'Validation errors', 400, extractErrors(body));
      const data = body.data;
      const year = await db.studyingYear.findUnique({
        where: { id: data.yearId },
      });
      const faculty = await db.faculty.findUnique({
        where: { id: data.facultyId },
      });
      if (!year) return notFound(res, "Year doesn't exist");
      if (!faculty) return notFound(res, "Faculty doesn't exist");
      if (year?.facultyId !== faculty?.id)
        return notFound(res, "Year doesn't belong to given faculty!");
      if (user.devices.length > 0) {
        const unsubRes = await messaging.unsubscribeFromTopic(
          user.devices.map(device => device.token),
          user.yearId.toString(),
        );
        await messaging.subscribeToTopic(
          user.devices.map(device => device.token),
          year.id.toString(),
        );
        await db.device.deleteMany({
          where: {
            id: {
              in: unsubRes.errors.map(({ index }) => user.devices[index].id),
            },
          },
        });
      }
      const updatedUser = await db.user.update({
        where: { id: user.id },
        data: {
          name: data.name,
          facultyId: data.facultyId,
          yearId: data.yearId,
        },
      });
      const { password, ...mainUser } = updatedUser;
      return res.status(200).json({
        message: 'User has been updated successfully.',
        status: 200,
        data: mainUser,
      });
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: 'Error - Something Went Wrong.',
        status: 500,
      });
    }
  }
 * 
 * 
 */
