import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";

const lessonListSchema = mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    lessons: [{
        title: { type: String, required: true },
        urlVideo: { type: String },
    }]
}, { collection: 'lessonList' });

lessonListSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: true
});

const lessonList = mongoose.model('lessonList', lessonListSchema);
export default lessonList;