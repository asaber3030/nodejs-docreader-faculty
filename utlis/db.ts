import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
export default db;

export const SUBJECT_INCLUDE = {
  module: { select: { id: true, semesterName: true, name: true } },
};
export const SUBJECT_ORDER_BY: any = { id: "asc" };

export function findSubjectMany(where?: any) {
  return db.subject.findMany({
    where,
    include: SUBJECT_INCLUDE,
    orderBy: SUBJECT_ORDER_BY,
  });
}

export async function findSubjectUnique(where?: any) {
  return (await findSubjectMany(where))[0];
}

export const LECTURE_INCLUDE = {
  subject: { select: { id: true, name: true, ...SUBJECT_INCLUDE } },
};
export const LECTURE_ORDER_BY: any = { date: "asc" };

export function findLectureMany(where?: any) {
  return db.lecture.findMany({
    where,
    include: LECTURE_INCLUDE,
    orderBy: LECTURE_ORDER_BY,
  });
}

export async function findLectureUnique(where?: any) {
  return (await findLectureMany(where))[0];
}

export const LINK_INCLUDE = {
  lectureData: {
    select: { id: true, title: true, ...LECTURE_INCLUDE },
  },
};
export const LINK_ORDER_BY: any = { id: "asc" };

export function findLinkMany(where?: any) {
  return db.lectureLink.findMany({
    where,
    include: LINK_INCLUDE,
    orderBy: LINK_ORDER_BY,
  });
}

export async function findLinkUnique(where?: any) {
  return (await findLinkMany(where))[0];
}
