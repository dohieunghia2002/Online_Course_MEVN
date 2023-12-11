import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";

const coursesTeacherSchema = new mongoose.Schema({
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    courses: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    ]
}, { collection: 'coursesTeacher' });

coursesTeacherSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: true
});

const CoursesTeacher = mongoose.model('CoursesTeacher', coursesTeacherSchema);
export default CoursesTeacher;