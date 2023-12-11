import express from 'express';
import userController from "../controllers/user.controller.js";
import middleware from '../middlewares/token.js';

const router = express.Router();

router.get('/:id/my-courses/:idCourse', userController.processCourseStudent);
router.get('/:id/my-courses', userController.coursesStudent);
router.get('/entire/teacher', userController.entireTeacher);
router.get('/entire/student', userController.entireStudent);
router.get('/deleted/stored', userController.deletedList);
router.get('/teacher/:id', userController.showTeacher);
router.get('/student/:id', userController.showStudent);

router.patch('/:id/avatar', middleware.verifyToken, userController.updateAvatar);
router.put('/teacher/edit', middleware.verifyToken, userController.updateTeacher);
router.put('/restore', middleware.verifyTokenAdmin, userController.restoreUser);

router.delete('/:id/destroy', middleware.verifyTokenAdmin, userController.destroyUser);
router.delete('/:id', middleware.verifyTokenAdmin, userController.deleteUser);


export default router;