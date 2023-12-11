import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    description: { type: String },
    category: { type: String, enum: ['web', 'ml', 'algorithm', 'other'], required: true },
    benefits: [{ type: String }],
    quantityStudent: { type: Number, default: 0 },
    quantityLesson: { type: Number, default: 0 },
    createdDate: { type: Date, default: Date.now },
    isCompleted: { type: Boolean, default: false },
    coverPhoto: {
        id: { type: String },
        url: { type: String }
    }
}, { collection: 'course' });

courseSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: true
});

const Course = mongoose.model('Course', courseSchema);
export default Course;