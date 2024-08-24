import { PrismaClient, LectureLink, Lecture, Subject } from "@prisma/client";

const db = new PrismaClient()
export default db

interface LinkWithPath extends LectureLink {
  semesterName: number;
  moduleId: number;
  moduleName: string;
  subjectId: number;
  subjectName: string;
  // lectureId: number;
  lectureName: string;
}

export async function findLinkMany(key: string, value: string | number): Promise<LinkWithPath[]> {
  return db.$queryRawUnsafe(
    `SELECT
      ll.id, ll.title, ll.subTitle, ll.url, ll.type,
      ll.category, ll.createdAt, ll.updatedAt,
      m.semesterName, m.id AS moduleId, m.name AS moduleName,
      l.subjectId, s.name AS subjectName, ll.lectureId,
      l.title AS lectureTitle
    FROM
      LectureLink ll
    JOIN
      Lecture l ON ll.lectureId = l.id
    JOIN
      Subject s ON l.subjectId = s.id
    JOIN
      Module m ON s.moduleId = m.id
    WHERE ll.${key} = ?`,
    value
  )
}

export async function findLinkUnique(key: string, value: string | number): Promise<LinkWithPath | undefined> {
  return (await findLinkMany(key, value))[0]
}

interface LectureWithPath extends Lecture {
  semesterName: number;
  moduleId: number;
  moduleName: string;
  // subjectId: number;
  subjectName: string;
}

export async function findLectureMany(key: string, value: string | number): Promise<LectureWithPath[]> {
  return db.$queryRawUnsafe(
    `SELECT
      l.id, l.title, l.subTitle, l.type, l.date, l.createdAt, l.updatedAt,
      m.semesterName, m.id AS moduleId, m.name AS moduleName,
      l.subjectId, s.name AS subjectName
    FROM
      Lecture l
    JOIN
      Subject s ON l.subjectId = s.id
    JOIN
	    Module m ON s.moduleId = m.id
    WHERE l.${key} = ?`,
    value
  )
}

export async function findLectureUnique(key: string, value: string | number): Promise<LectureWithPath | undefined> {
  return (await findLectureMany(key, value))[0]
}

interface SubjectWithPath extends Subject {
  semesterName: number;
  // moduleId: number;
  moduleName: string;
}

export async function findSubjectMany(key: string, value: string | number): Promise<SubjectWithPath[]> {
  return db.$queryRawUnsafe(
    `SELECT
      s.id, s.name, s.icon, s.createdAt, s.updatedAt,
      m.semesterName, m.id AS moduleId, m.name AS moduleName
    FROM
      Subject s
    JOIN
      Module m ON s.moduleId = m.id
    WHERE s.${key} = ?`,
    value
  )
}

export async function findSubjectUnique(key: string, value: string | number): Promise<SubjectWithPath | undefined> {
  return (await findSubjectMany(key, value))[0]
}

