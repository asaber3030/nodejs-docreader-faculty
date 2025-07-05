import { Request, Response } from 'express';
import db, { findQuizUnique, QUIZ_INCLUDE } from '../../utils/db';
import { quizSchema } from '../../schema';
import { currentDate } from '../../utils/helpers';
import UserController from './UserController';
import { badRequest, notFound } from '../../utils/responses';

export default class QuizController {
  async createQuiz(req: Request, res: Response) {
    try {
      const lectureId = +req.params.lectureId;
      const data = quizSchema.quiz.create.parse(req.body);
      const createdQuiz = await db.quiz.create({
        data: {
          ...data,
          lectureId,
          createdAt: currentDate(),
        },
      });
      return res.status(201).json({
        data: createdQuiz,
        message: 'Quiz has been created.',
        status: 201,
      });
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: 'Error - Something Went Wrong.',
        status: 500,
      });
    }
  }

  async getQuiz(req: Request, res: Response) {
    try {
      const quizId = +req.params.quizId;
      const quiz = await findQuizUnique({ id: quizId });
      if (!quiz) {
        return res.status(404).json({
          message: "Quiz doesn't exist.",
          status: 404,
        });
      }
      return res.status(200).json({
        data: quiz,
        message: 'Quiz',
        status: 200,
      });
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: 'Error - Something Went Wrong.',
        status: 500,
      });
    }
  }

  async updateQuiz(req: Request, res: Response) {
    try {
      const quizId = +req.params.quizId;
      const data = quizSchema.quiz.update.parse(req.body);
      const updatedQuiz = await db.quiz.update({
        where: { id: quizId },
        data: { ...data, notifiable: true },
      });
      return res.status(200).json({
        data: updatedQuiz,
        message: 'Quiz has been updated.',
        status: 200,
      });
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: 'Error - Something Went Wrong.',
        status: 500,
      });
    }
  }

  async deleteQuiz(req: Request, res: Response) {
    try {
      const quizId = +req.params.quizId;
      const quiz = await db.quiz.delete({
        where: { id: quizId },
        include: QUIZ_INCLUDE,
      });
      return res.status(200).json({
        data: quiz,
        message: 'Quiz has been deleted.',
        status: 200,
      });
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: 'Error - Something Went Wrong.',
        status: 500,
      });
    }
  }

  async createQuestion(req: Request, res: Response) {
    try {
      const quizId = +req.params.quizId;
      const data = quizSchema.question.create.parse(req.body);
      const createdQuestions = await db.question.createMany({
        data: data.map(question => ({
          ...question,
          quizId,
          createdAt: currentDate(),
        })),
      });
      await db.quiz.update({
        where: { id: quizId },
        data: { notifiable: true },
      });
      return res.status(201).json({
        data: createdQuestions,
        message: 'Question has been created.',
        status: 201,
      });
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: 'Error - Something Went Wrong.',
        status: 500,
      });
    }
  }

  async updateQuestion(req: Request, res: Response) {
    try {
      const questionId = +req.params.questionId;
      const data = quizSchema.question.update.parse(req.body);
      const updatedQuestion = await db.question.update({
        where: { id: questionId },
        data,
      });
      await db.quiz.update({
        where: { id: updatedQuestion.quizId },
        data: { notifiable: true },
      });
      return res.status(200).json({
        data: updatedQuestion,
        message: 'Question has been updated.',
        status: 200,
      });
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: 'Error - Something Went Wrong.',
        status: 500,
      });
    }
  }

  async deleteQuestion(req: Request, res: Response) {
    try {
      const questionId = +req.params.questionId;
      const question = await db.question.delete({
        where: { id: questionId },
      });
      await db.quiz.update({
        where: { id: question.quizId },
        data: { notifiable: true },
      });
      return res.status(200).json({
        data: question,
        message: 'Question has been deleted.',
        status: 200,
      });
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: 'Error - Something Went Wrong.',
        status: 500,
      });
    }
  }

  async markQuestion(req: Request, res: Response) {
    try {
      const questionId = +req.params.questionId;
      const user = await UserController.user(req);
      if (!user) return notFound(res, 'No User was found');
      if (
        await db.markedQuestion.findFirst({
          where: { questionId, userId: user.id },
        })
      )
        return badRequest(res, 'Question already marked');

      await db.markedQuestion.create({
        data: {
          questionId,
          userId: user.id,
          createdAt: currentDate(),
        },
      });
      return res.status(201).json({
        message: 'Question has been marked.',
        status: 201,
      });
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: 'Error - Something Went Wrong.',
        status: 500,
      });
    }
  }

  async unmarkQuestion(req: Request, res: Response) {
    try {
      const questionId = +req.params;
      const user = await UserController.user(req);
      if (!user) return notFound(res, 'No User was found');
      const markedQuestion = await db.markedQuestion.deleteMany({
        where: { questionId, userId: user.id },
      });
      return res.status(200).json({
        data: markedQuestion,
        message: 'Question has been unmarked.',
        status: 200,
      });
    } catch (errorObject) {
      return res.status(500).json({
        errorObject,
        message: 'Error - Something Went Wrong.',
        status: 500,
      });
    }
  }
}
