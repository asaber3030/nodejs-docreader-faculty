import { Request, Response } from "express";

import db, { lectureQuery, linkQuery, subjectQuery } from "../../utlis/db";
import { send } from "../../utlis/responses";

export default class YearController {
  async getSubjects(req: Request, res: Response) {
    const yearId = +req.params.yearId;
    const subjects = await db.$queryRawUnsafe(
      `${subjectQuery} WHERE m."yearId" = $1`,
      yearId
    );
    return send(res, "Year subjects", 200, subjects);
  }

  async getLectures(req: Request, res: Response) {
    const yearId = +req.params.yearId;
    const lectures = await db.$queryRawUnsafe(
      `${lectureQuery} WHERE m."yearId" = $1`,
      yearId
    );
    return send(res, "Year lectures", 200, lectures);
  }

  async getLinks(req: Request, res: Response) {
    const yearId = +req.params.yearId;
    const links = await db.$queryRawUnsafe(
      `${linkQuery} WHERE m."yearId" = $1`,
      yearId
    );
    return send(res, "Year links", 200, links);
  }
}
