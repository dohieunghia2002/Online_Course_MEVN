import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";

const coursesStudentSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    courses: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }
    ]
}, { collection: 'coursesStudent' });

coursesStudentSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: true
});

const CoursesStudent = mongoose.model('CoursesStudent', coursesStudentSchema);
export default CoursesStudent;