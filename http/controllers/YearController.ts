import { Request, Response } from "express";

import db, {
  findLinkMany,
  findSubjectMany,
  LECTURE_INCLUDE,
  LECTURE_ORDER_BY,
  MODULE_ORDER_BY,
} from "../../utlis/db";
import { send } from "../../utlis/responses";
import { notificationSchema } from "../../schema";
import {
  bolderizeWord,
  extractErrors,
  getUniqueObjectsById,
} from "../../utlis/helpers";
import { messaging } from "../../utlis/firebase";
import { WEBAPP_URL } from "../../utlis/constants";

export default class YearController {
  async getModules(req: Request, res: Response) {
    try {
      const yearId = +req.params.yearId;
      const modules = await db.module.findMany({
        where: { yearId },
        orderBy: MODULE_ORDER_BY,
      });
      return send(res, "Year modules", 200, modules);
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500,
      });
    }
  }

  async getSubjects(req: Request, res: Response) {
    try {
      const yearId = +req.params.yearId;
      const subjects = await findSubjectMany({ module: { yearId: yearId } });
      return send(res, "Year subjects", 200, subjects);
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500,
      });
    }
  }

  async getLectures(req: Request, res: Response) {
    try {
      const yearId = +req.params.yearId;
      const { search, limit, offset } = req.query;
      let limitNum, offsetNum;
      if (limit) limitNum = +limit;
      else limitNum = 100;
      if (offset) offsetNum = +offset;
      else offsetNum = 0;
      const lectures = await db.lecture.findMany({
        where: {
          subject: { module: { yearId } },
          title: { contains: search?.toString(), mode: "insensitive" },
        },
        include: LECTURE_INCLUDE,
        orderBy: LECTURE_ORDER_BY,
        take: limitNum,
        skip: offsetNum,
      });
      return send(res, "Year lectures", 200, lectures);
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500,
      });
    }
  }

  async getLinks(req: Request, res: Response) {
    try {
      const yearId = +req.params.yearId;
      const links = await findLinkMany({
        lectureData: { subject: { module: { yearId } } },
      });
      return send(res, "Year links", 200, links);
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500,
      });
    }
  }

  async getNotifiableLinks(req: Request, res: Response) {
    try {
      const yearId = +req.params.yearId;
      const links = await findLinkMany({
        lectureData: { subject: { module: { yearId } } },
        notifiable: true,
      });
      return send(res, "Year links", 200, links);
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500,
      });
    }
  }

  async notify(req: Request, res: Response) {
    try {
      const yearId = +req.params.yearId;
      const body = notificationSchema.notify.safeParse(req.body);
      const data = body.data;

      if (!body.success) {
        const errors = extractErrors(body);
        return res.status(400).json({
          errors,
          message: "Form validation errors.",
          status: 400,
        });
      }

      if (!data) {
        return res.status(400).json({
          message: "Please check there's valid JSON data in the request body.",
          status: 400,
        });
      }

      const query = {
        AND: [
          { id: { in: data.links } },
          { lectureData: { subject: { module: { yearId } } } },
        ],
      };

      await db.lectureLink.updateMany({
        where: query,
        data: { notifiable: false },
      });

      const links = await findLinkMany({
        lectureData: { subject: { module: { yearId } } },
        id: { in: data.links },
      });

      const lectures = getUniqueObjectsById(
        links.map(
          ({
            lectureId,
            lectureData: {
              title: lectureTitle,
              subject: {
                id: subjectId,
                name: subjectName,
                module: { name: moduleName },
              },
            },
          }) => ({
            id: lectureId,
            title: lectureTitle,
            subjectId,
            subjectName,
            moduleName,
          })
        )
      ).map((lecture) => ({
        ...lecture,
        links: links.filter((link) => link.lectureId === lecture.id),
      }));

      let message = "";

      for (const lecture of lectures) {
        message += "👈 ";
        if (lecture.title === "Practical Data")
          message +=
            "في عملي مادة " +
            bolderizeWord(lecture.subjectName) +
            " موديول " +
            bolderizeWord(lecture.moduleName);
        else if (lecture.title === "Final Revision Data")
          message +=
            "في المراجعة النهائية لمادة " +
            bolderizeWord(lecture.subjectName) +
            " موديول " +
            bolderizeWord(lecture.moduleName);
        else message += "في محاضرة " + bolderizeWord(lecture.title);
        message += ` تم إضافة المصادر التالية:\n${lecture.links
          .map(({ title }) => `💥 ${title}\n`)
          .join("")}`;
      }

      await messaging.send({
        notification: {
          title: "تم إضافة مصادر جديدة 🔥",
          body: message,
        },
        webpush: {
          fcmOptions: {
            link:
              WEBAPP_URL +
              (lectures.length === 1 ? `/lectures/${lectures[0].id}` : ""),
          },
        },
        topic: yearId.toString(),
      });

      return res
        .status(200)
        .json({ message: "Notification was sent successfully", status: 200 });
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500,
      });
    }
  }

  async ignore(req: Request, res: Response) {
    try {
      const yearId = +req.params.yearId;
      const body = notificationSchema.notify.safeParse(req.body);
      const data = body.data;

      if (!body.success) {
        const errors = extractErrors(body);
        return res.status(400).json({
          errors,
          message: "Form validation errors.",
          status: 400,
        });
      }

      if (!data) {
        return res.status(400).json({
          message: "Please check there's valid JSON data in the request body.",
          status: 400,
        });
      }

      await db.lectureLink.updateMany({
        where: {
          AND: [
            { id: { in: data.links } },
            { lectureData: { subject: { module: { yearId } } } },
          ],
        },
        data: { notifiable: false },
      });

      return res
        .status(200)
        .json({ message: "Links where ignored successfully", status: 200 });
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500,
      });
    }
  }
}
