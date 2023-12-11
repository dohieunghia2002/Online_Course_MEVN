import CoursesStudent from '../models/coursesStudent.model.js';
import CoursesTeacher from '../models/coursesTeacher.model.js';
import StudentList from '../models/studentList.model.js';
import LessonList from '../models/lessonList.model.js';
import User from '../models/user.model.js';
import Course from '../models/course.model.js';
import { v2 as cloudinary } from 'cloudinary';

// [GET] /user/:id/my-courses
const coursesStudent = async (req, res) => {
    try {
        // const all = await CoursesStudent.findOne({ student: req.params.id }).populate('courses');
        const all = await CoursesStudent.findOne({ student: req.params.id });
        const result = [];
        for (let i = 0; i < all.courses.length; i++) {
            const course = await Course.findOneWithDeleted({ _id: all.courses[i] });
            result.push(course);
        }
        all.courses = [...result];
        return res.status(200).json(all);
    } catch (error) {
        return res.status(500).json(error);
    }
}

// [GET] /user/:id/my-courses/:idCourse
const processCourseStudent = async (req, res) => {
    try {
        const entire = await StudentList.findOne({ course: req.params.idCourse });
        const size = entire.students.length;
        for (let i = 0; i < size; i++) {
            if (entire.students[i].idStudent == req.params.id) {
                return res.status(200).json(entire.students[i]);
            }
        }
    } catch (error) {
        return res.status(500).json(error);
    }
}

// [GET] /user/entire/teacher
const entireTeacher = async (req, res) => {
    try {
        const all = await User.find({ role: 'Teacher' });

        const newAll = [...all];
        let sizeAll = newAll.length;
        for (let i = 0; i < sizeAll; i++) {
            newAll[i].password = undefined;
            newAll[i].__v = undefined;
            newAll[i].refreshToken = undefined;
            const temp = await CoursesTeacher.findOne({ teacher: newAll[i]._id });
            const len = temp.courses.length;
            Object.assign(newAll[i]._doc, { totalCourse: len });

            if (len > 0) {
                const course = await Course.findOneWithDeleted({ _id: temp.courses[0] });
                const coursesPopular = course.name;
                Object.assign(newAll[i]._doc, { coursesPopular: coursesPopular });
            }
            else {
                const coursesPopular = 'chưa có khóa học';
                Object.assign(newAll[i]._doc, { coursesPopular: coursesPopular });
            }
        }
        return res.status(200).json(newAll);
    } catch (error) {
        return res.status(500).json(error);
    }
}

// [GET] /user/entire/student
const entireStudent = async (req, res) => {
    try {
        const all = await User.find({ role: 'Student' });

        const newAll = [...all];
        for (let i = 0; i < newAll.length; i++) {
            newAll[i].password = undefined;
            newAll[i].__v = undefined;
            newAll[i].refreshToken = undefined;
            const temp = await CoursesStudent.findOne({ student: newAll[i]._id });
            Object.assign(newAll[i]._doc, { totalCourse: temp.courses.length });
        }
        return res.status(200).json(newAll);
    } catch (error) {
        return res.status(500).json(error);
    }
}

// [GET] /user/teacher/:id
const showTeacher = async (req, res) => {
    try {
        const user = await User.findOneWithDeleted({ _id: req.params.id });
        user.password = undefined;
        user.__v = undefined;
        user.refreshToken = undefined;
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json(error);
    }
}

// [GET] /user/student/:id
const showStudent = async (req, res) => {
    try {
        const user = await User.findOneWithDeleted({ _id: req.params.id });
        user.password = undefined;
        user.__v = undefined;
        user.refreshToken = undefined;
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json(error);
    }
}

// [PUT] /user/teacher/edit
const updateTeacher = async (req, res) => {
    const { fullName, gender, phone, idTeacher } = req.body;
    try {
        const id = idTeacher || req.user.id;
        const user = await User.findByIdAndUpdate(id, {
            fullName, gender, phone
        }, { new: true });
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json(error);
    }
}

// [DELETE] /user/:id
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        await User.delete({ _id: req.params.id });
        if (user.role == 'Teacher') {
            await CoursesTeacher.delete({ teacher: user._id });
        }
        else {
            await CoursesStudent.delete({ student: user._id });
        }
        return res.status(200).json('deleted successfully');
    } catch (error) {
        return res.status(500).json(error);
    }
}

// [GET] /user/deleted/stored
const deletedList = async (req, res) => {
    try {
        const all = await User.findDeleted({});
        return res.status(200).json(all);
    } catch (error) {
        return res.status(500).json(error);
    }
}

// [PUT] /user/restore
const restoreUser = async (req, res) => {
    const { idUser } = req.body;
    try {
        await User.restore({ _id: idUser });
        const user = await User.findById(idUser);
        Object.assign(user._doc, { deleted: false });
        await user.save();
        if (user.role === 'Teacher') {
            await CoursesTeacher.restore({ teacher: idUser });
            const coursesL = await CoursesTeacher.findOne({ teacher: idUser });
            Object.assign(coursesL._doc, { deleted: false });
            await coursesL.save();
        } else {
            await CoursesStudent.restore({ student: idUser });
            const L = await CoursesStudent.findOne({ student: idUser });
            Object.assign(L._doc, { deleted: false });
            await L.save();
        }
        return res.status(200).json('restore successfully');
    } catch (error) {
        return res.status(500).json(error);
    }
}

// [DELETE] /user/:id/destroy
const destroyUser = async (req, res) => {
    try {
        const user = await User.findOneWithDeleted({ _id: req.params.id });
        if (user.avatar.id !== undefined) {
            const cloudIdDeleted = user.avatar.id;
            await cloudinary.uploader.destroy(cloudIdDeleted);
        }

        if (user.role === 'Teacher') {

            await User.deleteOne({ _id: req.params.id });
            const coursesTeacher = await CoursesTeacher.findOneWithDeleted({ teacher: user._id });
            await CoursesTeacher.deleteOne({ teacher: user._id });

            const coursesStudent = await CoursesStudent.find({});
            for (let i = 0; i < coursesTeacher.courses.length; i++) {
                await Course.deleteOne({ _id: coursesTeacher.courses[i] });
                await LessonList.deleteOne({ course: coursesTeacher.courses[i] });
                await StudentList.deleteOne({ course: coursesTeacher.courses[i] });
            }
            for (let j = 0; j < coursesStudent.length; j++) {
                const temp = coursesStudent[j].courses.filter(item => !coursesTeacher.courses.includes(item));
                coursesStudent[j].courses = [...temp]
                await coursesStudent[j].save();
            }
        }
        else if (user.role === 'Student') {
            await User.deleteOne({ _id: req.params.id });
            const coursesStudent = await CoursesStudent.findOneWithDeleted({ student: user._id });
            await CoursesStudent.deleteOne({ student: user._id });

            for (let i = 0; i < coursesStudent.courses.length; i++) {
                const idCourse = coursesStudent.courses[i];
                const course = await Course.findOneWithDeleted({ _id: idCourse });
                const studentList = await StudentList.findOneWithDeleted({ course: idCourse });
                let indexStudent = -1;

                for (let j = 0; j < studentList.students.length; j++) {
                    const temp = studentList.students[j].idStudent.toString();
                    if (temp == user._id.toString()) {
                        indexStudent = j;
                        break;
                    }
                }

                if (indexStudent != -1) {
                    studentList.students.splice(indexStudent, 1);
                }
                await studentList.save();
                course.quantityStudent = studentList.students.length;
                await course.save();
            }
        }
        return res.status(200).json('destroy successfully');
    } catch (error) {
        return res.status(500).json(error);
    }
}

// [PATCH] /user/:id/avatar
const updateAvatar = async (req, res) => {
    const { id, url } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (user.avatar.id !== undefined) {
            const cloudIdDeleted = user.avatar.id;
            await cloudinary.uploader.destroy(cloudIdDeleted);
        }
        user.avatar.id = id;
        user.avatar.url = url;
        await user.save();
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json(error);
    }
}

export default {
    coursesStudent,
    entireTeacher,
    entireStudent,
    showTeacher,
    showStudent,
    updateTeacher,
    processCourseStudent,
    deleteUser,
    deletedList,
    restoreUser,
    destroyUser,
    updateAvatar
}