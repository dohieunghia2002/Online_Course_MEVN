import mongoose from 'mongoose';
import mongooseDelete from 'mongoose-delete';

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    gender: { type: Boolean },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ['Student', 'Teacher', 'Admin'], default: 'Student' },
    avatar: {
        id: { type: String },
        url: { type: String }
    },
    joinDate: { type: Date, default: Date.now },
    refreshToken: { type: String }
}, { collection: 'user' });

userSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: true
});

const User = mongoose.model('User', userSchema);
export default User;