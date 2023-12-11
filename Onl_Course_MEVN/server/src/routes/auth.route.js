import express from 'express';
import authController from "../controllers/auth.controller.js";
import middleware from '../middlewares/token.js';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/signup/teacher', authController.registerTeacher);
router.post('/signin', authController.signin);
router.post('/refresh', authController.requestRefreshToken);
router.post('/logout', middleware.verifyToken, authController.signout);

export default router;