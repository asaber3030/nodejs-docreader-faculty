import { Request, Response } from "express";
import { practicalQuizSchema } from "../../schema";
import db, { findPracticalQuizUnique } from "../../utlis/db";
import { currentDate } from "../../utlis/helpers";
import path from "path";
import sharp from "sharp";
import { unlink } from "fs/promises";

interface NewRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface OldRect extends NewRect {
  id: number;
}
interface NewWrittenQuestion {
  text: string;
  answer: string;
}

interface OldWrittenQuestion extends NewWrittenQuestion {
  id: number;
}

export default class QuizController {
  async createQuiz(req: Request, res: Response) {
    try {
      const lectureId = +req.params.lectureId;
      const data = practicalQuizSchema.quiz.create.parse(req.body);
      const createdQuiz = await db.practicalQuiz.create({
        data: {
          ...data,
          lectureId,
          createdAt: currentDate(),
        },
      });
      return res.status(201).json({
        data: createdQuiz,
        message: "Quiz has been created.",
        status: 201,
      });
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500,
      });
    }
  }

  async getQuiz(req: Request, res: Response) {
    try {
      const quizId = +req.params.quizId;
      const quiz = await findPracticalQuizUnique({ id: quizId });
      if (!quiz) {
        return res.status(404).json({
          message: "Quiz doesn't exist.",
          status: 404,
        });
      }
      return res.status(200).json({
        data: quiz,
        message: "Quiz",
        status: 200,
      });
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500,
      });
    }
  }

  async updateQuiz(req: Request, res: Response) {
    try {
      const quizId = +req.params.quizId;
      const data = practicalQuizSchema.quiz.update.parse(req.body);
      const updatedQuiz = await db.practicalQuiz.update({
        where: { id: quizId },
        data: { ...data, notifiable: true },
      });
      return res.status(200).json({
        data: updatedQuiz,
        message: "Quiz has been updated.",
        status: 200,
      });
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500,
      });
    }
  }

  async deleteQuiz(req: Request, res: Response) {
    try {
      const quizId = +req.params.quizId;
      const quiz = await db.practicalQuiz.delete({
        where: { id: quizId },
        include: { questions: true },
      });
      for (const question of quiz.questions) {
        try {
          unlink(path.join(__dirname, "../../public/image", question.image));
        } catch (err) {
          console.error(err);
        }
      }
      return res.status(200).json({
        data: quiz,
        message: "Quiz has been deleted.",
        status: 200,
      });
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500,
      });
    }
  }

  async createQuestion(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No file has been uploaded.",
          status: 400,
        });
      }
      const filename = `${
        path.parse(req.file.originalname).name
      }-${Date.now()}.jpeg`;
      const outputPath = path.join(__dirname, "../../public/image", filename);
      const { width, height } = await sharp(req.file.buffer)
        .toFormat("jpeg")
        .jpeg({ quality: 80 })
        .toFile(outputPath);

      const quizId = +req.params.quizId;
      const { masks, tapes, writtenQuestions } =
        practicalQuizSchema.question.create.parse({
          tapes: JSON.parse(req.body.tapes),
          masks: JSON.parse(req.body.masks),
          writtenQuestions: JSON.parse(req.body.writtenQuestions),
        });
      const createdQuestion = await db.practicalQuestion.create({
        data: {
          quizId,
          image: filename,
          width,
          height,
          createdAt: currentDate(),
        },
      });
      await db.rect.createMany({
        data: masks.map((mask) => ({
          ...mask,
          maskQuestionId: createdQuestion.id,
          createdAt: currentDate(),
        })),
      });
      await db.rect.createMany({
        data: tapes.map((tape) => ({
          ...tape,
          tapeQuestionId: createdQuestion.id,
          createdAt: currentDate(),
        })),
      });
      await db.writtenQuestion.createMany({
        data: writtenQuestions.map((question) => ({
          ...question,
          questionId: createdQuestion.id,
          createdAt: currentDate(),
        })),
      });
      return res.status(201).json({
        data: createdQuestion,
        message: "Question has been created.",
        status: 201,
      });
    } catch (errorObject) {
      console.log(errorObject);
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500,
      });
    }
  }

  async updateQuestion(req: Request, res: Response) {
    try {
      const questionId = +req.params.questionId;
      const { masks, tapes, writtenQuestions } =
        practicalQuizSchema.question.update.parse(req.body);
      const newMasks: NewRect[] = [];
      const oldMasks: OldRect[] = [];
      const newTapes: NewRect[] = [];
      const oldTapes: OldRect[] = [];
      const newWrittenQuestions: NewWrittenQuestion[] = [];
      const oldWrittenQuestions: OldWrittenQuestion[] = [];
      masks.forEach((mask) =>
        mask.id
          ? oldMasks.push(mask as OldRect)
          : newMasks.push(mask as NewRect)
      );
      tapes.forEach((tape) =>
        tape.id
          ? oldTapes.push(tape as OldRect)
          : newTapes.push(tape as NewRect)
      );
      writtenQuestions.forEach((writtenQuestions) =>
        writtenQuestions.id
          ? oldWrittenQuestions.push(writtenQuestions as OldWrittenQuestion)
          : newWrittenQuestions.push(writtenQuestions as NewWrittenQuestion)
      );

      await db.rect.deleteMany({
        where: {
          tapeQuestionId: questionId,
          id: { notIn: oldTapes.map(({ id }) => id) },
        },
      });
      await db.rect.deleteMany({
        where: {
          maskQuestionId: questionId,
          id: { notIn: oldMasks.map(({ id }) => id) },
        },
      });
      await db.writtenQuestion.deleteMany({
        where: {
          questionId: questionId,
          id: { notIn: oldWrittenQuestions.map(({ id }) => id) },
        },
      });

      await db.rect.createMany({
        data: newMasks.map((mask) => ({
          ...mask,
          maskQuestionId: questionId,
          createdAt: currentDate(),
        })),
      });
      await db.rect.createMany({
        data: newTapes.map((tape) => ({
          ...tape,
          tapeQuestionId: questionId,
          createdAt: currentDate(),
        })),
      });
      await db.writtenQuestion.createMany({
        data: newWrittenQuestions.map((question) => ({
          ...question,
          questionId: questionId,
          createdAt: currentDate(),
        })),
      });
      await Promise.all(
        oldMasks.map(({ id, ...mask }) =>
          db.rect.update({
            where: { id },
            data: { ...mask },
          })
        )
      );
      await Promise.all(
        oldTapes.map(({ id, ...tape }) =>
          db.rect.update({
            where: { id },
            data: { ...tape },
          })
        )
      );
      await Promise.all(
        oldWrittenQuestions.map(({ id, ...writtenQuestion }) =>
          db.writtenQuestion.update({
            where: { id },
            data: { ...writtenQuestion },
          })
        )
      );
      const updatedQuestion = await db.practicalQuestion.findUnique({
        where: { id: questionId },
      });
      return res.status(200).json({
        data: updatedQuestion,
        message: "Question has been updated.",
        status: 200,
      });
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500,
      });
    }
  }

  async deleteQuestion(req: Request, res: Response) {
    try {
      const questionId = +req.params.questionId;
      const question = await db.practicalQuestion.delete({
        where: { id: questionId },
      });
      await db.practicalQuiz.update({
        where: { id: question.quizId },
        data: { notifiable: true },
      });
      try {
        unlink(path.join(__dirname, "../../public/image", question.image));
      } catch (err) {
        console.error(err);
      }
      return res.status(200).json({
        data: question,
        message: "Question has been deleted.",
        status: 200,
      });
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: "Error - Something Went Wrong.",
        status: 500,
      });
    }
  }
}
