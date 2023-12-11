import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";

const studentListSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    students: [
        {
            idStudent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            lessonLearning: { type: Number, default: 0 },
            isFinished: { type: Boolean, default: false }
        }
    ]
}, { collection: 'studentList' });

studentListSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: true
});

const StudentList = mongoose.model('StudentList', studentListSchema);
export default StudentList;