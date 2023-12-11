import express from 'express';
import courseController from '../controllers/course.controller.js';
import middleware from '../middlewares/token.js';

const router = express.Router();

router.get('/teacher/:id', courseController.coursesTeacher);
router.get('/all', courseController.allCourses);
router.get('/coming-soon', courseController.comingSoon);
router.get('/deleted', middleware.verifyToken, courseController.deletedList);
router.get('/:category/stored', courseController.coursesByCategory);
router.get('/:id/students', courseController.students);
router.get('/:id/lesson', courseController.entireLesson);
router.get('/:id', courseController.detailCourse);

router.post('/new', middleware.verifyToken, courseController.createNew);

router.patch('/complete', middleware.verifyToken, courseController.toggleCompleted);

router.put('/enroll', middleware.verifyToken, courseController.enrollMe);
router.put('/edit', middleware.verifyToken, courseController.editInfo);
router.put('/student/learning', middleware.verifyToken, courseController.updateLessonLearning);
router.put('/restore', middleware.verifyToken, courseController.restoreCourse);

router.delete('/:id/remove', middleware.verifyToken, courseController.removeCourse);
router.delete('/:id', middleware.verifyToken, courseController.deleteCourse);

export default router;