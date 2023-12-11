import Course from '../models/course.model.js';
import LessonList from '../models/lessonList.model.js';
import StudentList from '../models/studentList.model.js';
import CoursesTeacher from '../models/coursesTeacher.model.js';
import CoursesStudent from '../models/coursesStudent.model.js';
import User from '../models/user.model.js';

import { v2 as cloudinary } from 'cloudinary';

// [POST] /course/new
const createNew = async (req, res) => {
    const { name, teacher, description, benefits, category, coverPhoto } = req.body;
    try {
        const course = await Course.create({ name, teacher, description, benefits, category, coverPhoto });
        await LessonList.create({ course: course._id });
        await StudentList.create({ course: course._id });
        const coursesTeacher = await CoursesTeacher.findOne({ teacher });
        coursesTeacher.courses.push(course._id);
        await coursesTeacher.save();
        return res.status(201).json(course);
    } catch (error) {
        return res.status(500).json(error);
    }
}

// [GET] /course/teacher/:id
const coursesTeacher = async (req, res) => {
    try {
        const entire = await CoursesTeacher.findOne({ teacher: req.params.id }).populate('courses');
        return res.status(200).json(entire);
    } catch (error) {
        return res.status(500).json(error);
    }
}

// [GET] /course/:id
const detailCourse = async (req, res) => {
    try {
        const detail = await Course.findById(req.params.id);
        const teacher = await User.findOneWithDeleted({ _id: detail.teacher });
        Object.assign(detail._doc, { teacherName: teacher.fullName });
        return res.status(200).json(detail);
    } catch (error) {
        return res.status(500).json(error);
    }
}

// [PUT] /course/edit
const editInfo = async (req, res) => {
    const { _id, name, description, category, benefits } = req.body;
    try {
        const course = await Course.findByIdAndUpdate(_id, {
            name, description, benefits, category
        }, { new: true });
        return res.status(200).json(course);
    } catch (error) {
        return res.status(500).json(error);
    }
}

// [GET] /course/:id/lesson
const entireLesson = async (req, res) => {
    try {
        const entire = await LessonList.findOne({ course: req.params.id });
        return res.status(200).json(entire);
    } catch (error) {
        return res.status(500).json(error);
    }
}

// [GET] /course/all
const allCourses = async (req, res) => {
    try {
        const all = await Course.find({ isCompleted: true });
        for (let i = 0; i < all.length; i++) {
            const teacher = await User.findOneWithDeleted({ _id: all[i].teacher });
            Object.assign(all[i]._doc, { teacherName: teacher.fullName });
        }
        return res.status(200).json(all);
    } catch (error) {
        return res.status(500).json(error);
    }
}

// [GET] /course/:category/stored
const coursesByCategory = async (req, res) => {
    try {
        const all = await Course.find({ category: req.params.category, isCompleted: true });
        for (let i = 0; i < all.length; i++) {
            const teacher = await User.findOneWithDeleted({ _id: all[i].teacher });
            Object.assign(all[i]._doc, { teacherName: teacher.fullName });
        }
        return res.status(200).json(all);
    } catch (error) {
        return res.status(500).json(error);
    }
}

// [GET] /course/coming-soon
const comingSoon = async (req, res) => {
    try {
        const all = await Course.find({ isCompleted: false });
        for (let i = 0; i < all.length; i++) {
            const teacher = await User.findOneWithDeleted({ _id: all[i].teacher });
            Object.assign(all[i]._doc, { teacherName: teacher.fullName });
        }
        return res.status(200).json(all);
    } catch (error) {
        return res.status(500).json(error);
    }
}

// [PUT] /course/enroll
const enrollMe = async (req, res) => {
    const { course } = req.body;
    try {
        const enroll = await CoursesStudent.findOne({ student: req.user.id });
        for (let i = 0; i < enroll.courses.length; i++) {
            if (enroll.courses[i] == course) {
                return res.status(409).json('Course already enroll');
            }
        }
        enroll.courses.push(course); // update courses of student
        await enroll.save();

        const newStudent = {
            idStudent: req.user.id,
            lessonLearning: 0,
            isFinished: false
        }
        const studentL = await StudentList.findOne({ course });
        studentL.students.push(newStudent);
        await studentL.save(); // update student list of course

        const courseDB = await Course.findById(course);
        courseDB.quantityStudent = studentL.students.length;
        await courseDB.save(); // update quantity student of course

        return res.status(200).json('Enroll successfully');
    } catch (error) {
        return res.status(500).json(error);
    }
}

// [GET] /course/:id/students
const students = async (req, res) => {
    try {
        const all = await StudentList.findOneWithDeleted({ course: req.params.id });

        for (let i = 0; i < all.students.length; i++) {
            const dataStudent = await User.findOneWithDeleted({ _id: all.students[i].idStudent });
            dataStudent.password = undefined;
            dataStudent.refreshToken = undefined;
            dataStudent.__v = undefined;
            all.students[i].idStudent = dataStudent;
        }
        return res.status(200).json(all);
    } catch (error) {
        return res.status(500).json(error);
    }
}

// [PATCH] /course/complete
const toggleCompleted = async (req, res) => {
    const { id } = req.body;
    try {
        const course = await Course.findById(id);
        course.isCompleted = !course.isCompleted;
        await course.save();
        return res.status(200).json(course);
    } catch (error) {
        return res.status(500).json(error);
    }
}

// [DELETE] /course/:id
const deleteCourse = async (req, res) => {
    try {
        const idCourse = req.params.id;
        const course = await Course.findById(idCourse);
        if (req.user.id == course.teacher || req.user.role == 'Admin') {
            await Course.delete({ _id: idCourse });
            await LessonList.delete({ course: idCourse });
            await StudentList.delete({ course: idCourse });
            return res.status(200).json('Deleted successfully');
        }
        else {
            return res.status(405).json('You are not allowed');
        }
    } catch (error) {
        return res.status(500).json(error);
    }
}

// [GET] /course/deleted
const deletedList = async (req, res) => {
    try {
        if (req.user.role == 'Teacher') {
            const courses = await Course.findDeleted({ teacher: req.user.id });
            return res.status(200).json(courses);
        }
        else if (req.user.role == 'Admin') {
            const courses = await Course.findDeleted({});
            const size = courses.length;
            for (let i = 0; i < size; i++) {
                const teacher = await User.findOneWithDeleted({ _id: courses[i].teacher });
                Object.assign(courses[i]._doc, { nameTeacher: teacher.fullName });
            }
            return res.status(200).json(courses);
        }
    } catch (error) {
        return res.status(500).json(error);
    }
}

// [PUT] /course/restore
const restoreCourse = async (req, res) => {
    const { idCourse } = req.body;
    try {
        await Course.restore({ _id: idCourse });
        await LessonList.restore({ course: idCourse });
        await StudentList.restore({ course: idCourse });

        const course = await Course.findById(idCourse);
        const lessons = await LessonList.findOne({ course: idCourse });
        const studentL = await StudentList.findOne({ course: idCourse });
        Object.assign(course, { deleted: false });
        Object.assign(lessons, { deleted: false });
        Object.assign(studentL, { deleted: false });
        await course.save();
        await lessons.save();
        await studentL.save();
        return res.status(200).json(course);
    } catch (error) {
        return res.status(500).json(error);
    }
}

// [DELETE] /course/:id/remove
const removeCourse = async (req, res) => {
    try {
        const id = req.params.id;
        const course = await Course.findByIdAndDelete(id);
        const lesson = await LessonList.findOneAndDelete({ course: course._id });
        const studentL = await StudentList.findOneAndDelete({ course: course._id });
        const cloudIdDeleted = course.coverPhoto.id;

        const coursesTeacher = await CoursesTeacher.findOneWithDeleted({ teacher: course.teacher });
        const index = coursesTeacher.courses.indexOf(course._id);
        if (index !== -1) {
            coursesTeacher.courses.splice(index, 1);
        }
        await cloudinary.uploader.destroy(cloudIdDeleted);
        await coursesTeacher.save();

        const size = studentL.students.length;
        for (let i = 0; i < size; i++) {
            const coursesUser = await CoursesStudent.findOneWithDeleted({ student: studentL.students[i].idStudent });
            const idx = coursesUser.courses.indexOf(course._id);
            if (idx !== -1) {
                coursesUser.courses.splice(idx, 1);
            }
            await coursesUser.save();
        }
        return res.status(200).json('remove successfully');
    } catch (error) {
        return res.status(500).json(error);
    }
}

// [PUT] /course/student/learning
const updateLessonLearning = async (req, res) => {
    const { course, idStudent, ep } = req.body;
    try {
        const studentL = await StudentList.findOne({ course }).populate('course');
        const quantityL = studentL.course.quantityLesson - 1;
        let idx = -1;
        for (let i = 0; i < studentL.students.length; i++) {
            if (studentL.students[i].idStudent.toString() == idStudent.toString()) {
                idx = i;
                if (studentL.students[i].lessonLearning < ep) {
                    studentL.students[i].lessonLearning = ep;
                    if (studentL.students[i].lessonLearning == quantityL) {
                        studentL.students[i].isFinished = true;
                    }
                }
            }
        }
        await studentL.save();
        const result = studentL.students[idx].lessonLearning;
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json(error);
    }
}

export default {
    createNew,
    coursesTeacher,
    detailCourse,
    editInfo,
    entireLesson,
    allCourses,
    comingSoon,
    enrollMe,
    students,
    toggleCompleted,
    deleteCourse,
    deletedList,
    restoreCourse,
    removeCourse,
    coursesByCategory,
    updateLessonLearning
}