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
    const { search, limit, offset } = req.query;

    const searchPattern = search ? `%${search}%` : `%`;
    let limitNum, offsetNum;
    if (limit) limitNum = +limit;
    else limitNum = Number.POSITIVE_INFINITY;
    if (offset) offsetNum = +offset;
    else offsetNum = 0;

    const lectures = await db.$queryRawUnsafe(
      `${lectureQuery} WHERE m."yearId" = $1 AND LOWER(l.title) LIKE LOWER($2) LIMIT $3 OFFSET $4`,
      yearId,
      searchPattern,
      limitNum,
      offsetNum
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
