import PracticalQuizController from "../http/controllers/PracticalQuizController";

import { Router } from "express";
import { checkIsAdmin } from "../middlewares/isAdmin";

import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage });

const quizRouter = Router();
const controller = new PracticalQuizController();

quizRouter.get("/practical-quizzes/:quizId", controller.getQuiz);
quizRouter.post(
  "/lectures/:lectureId/practical-quizzes",
  checkIsAdmin,
  controller.createQuiz
);
quizRouter.patch(
  "/practical-quizzes/:quizId",
  checkIsAdmin,
  controller.updateQuiz
);
quizRouter.delete(
  "/practical-quizzes/:quizId",
  checkIsAdmin,
  controller.deleteQuiz
);

quizRouter.post(
  "/practical-quizzes/:quizId/practical-questions",
  checkIsAdmin,
  upload.single("image"),
  controller.createQuestion
);
quizRouter.patch(
  "/practical-questions/:questionId",
  checkIsAdmin,
  controller.updateQuestion
);
quizRouter.delete(
  "/practical-questions/:questionId",
  checkIsAdmin,
  controller.deleteQuestion
);

export default quizRouter;
