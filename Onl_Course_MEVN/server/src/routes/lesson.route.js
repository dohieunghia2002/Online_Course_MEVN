import express from 'express';
import lessonController from '../controllers/lesson.controller.js';
import middleware from '../middlewares/token.js';

const router = express.Router();

router.get('/course/:id', lessonController.lessons);

router.put('/update', middleware.verifyToken, lessonController.updateLesson);

export default router;