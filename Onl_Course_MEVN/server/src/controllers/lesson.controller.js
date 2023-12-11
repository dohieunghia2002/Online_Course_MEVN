import LessonList from '../models/lessonList.model.js';
import Course from '../models/course.model.js';

// [PUT] /lesson/update
const updateLesson = async (req, res) => {
    const { course, lessons } = req.body;
    try {
        const lessonList = await LessonList.findOneAndUpdate({ course }, {
            lessons
        }, { new: true })
        const courseDB = await Course.findById(course);
        courseDB.quantityLesson = lessons.length;
        courseDB.save();
        return res.status(200).json(lessonList);
    } catch (error) {
        return res.status(500).json(error);
    }
}

// [GET] /lesson/course/:id
const lessons = async (req, res) => {
    try {
        const lessonList = await LessonList.findOne({ course: req.params.id });
        return res.status(200).json(lessonList);
    } catch (error) {
        return res.status(500).json(error);
    }
}

export default {
    updateLesson,
    lessons
}