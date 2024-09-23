import { Request, Response } from "express";

import db, {
  lectureOrder,
  lectureQuery,
  linkOrder,
  linkQuery,
  LinkWithPath,
  subjectOrder,
  subjectQuery,
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
      const modules = await db.module.findMany({ where: { yearId } });
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
      const subjects = await db.$queryRawUnsafe(
        `${subjectQuery} WHERE m."yearId" = $1 ${subjectOrder}`,
        yearId
      );
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

      const searchPattern = search ? `%${search}%` : `%`;
      let limitNum, offsetNum;
      if (limit) limitNum = +limit;
      else limitNum = Number.POSITIVE_INFINITY;
      if (offset) offsetNum = +offset;
      else offsetNum = 0;

      const lectures = await db.$queryRawUnsafe(
        `${lectureQuery} WHERE m."yearId" = $1 AND LOWER(l.title) LIKE LOWER($2) ${lectureOrder} LIMIT $3 OFFSET $4`,
        yearId,
        searchPattern,
        limitNum,
        offsetNum
      );
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
      const links = await db.$queryRawUnsafe(
        `${linkQuery} WHERE m."yearId" = $1 ${linkOrder}`,
        yearId
      );
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
      const links = await db.$queryRawUnsafe(
        `${linkQuery} WHERE m."yearId" = $1 AND ll.notifiable = TRUE ${linkOrder}`,
        yearId
      );
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

      const links = (await db.$queryRawUnsafe(
        `${linkQuery} WHERE m."yearId" = $1 AND ll.id IN (${data.links.join(
          ", "
        )}) ${linkOrder}`,
        yearId
      )) as LinkWithPath[];

      const lectures = getUniqueObjectsById(
        links.map(({ lectureId, lectureTitle, subjectId }) => ({
          id: lectureId,
          title: lectureTitle,
          subjectId,
        }))
      ).map((lecture) => ({
        ...lecture,
        links: links.filter((link) => link.lectureId === lecture.id),
      }));

      let message = "";

      for (const lecture of lectures) {
        message += `👈 في المحاضرة ${bolderizeWord(
          lecture.title
        )} تم إضافة المصادر التالية:\n${lecture.links
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
