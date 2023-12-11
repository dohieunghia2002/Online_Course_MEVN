import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import User from "../models/user.model.js";
import CoursesStudent from '../models/coursesStudent.model.js';
import CoursesTeacher from '../models/coursesTeacher.model.js';

const generateAccessToken = async (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: '24h' }
    );
}

const generateRefreshToken = async (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_REFRESH_KEY,
        { expiresIn: '365d' }
    );
}

// [POST] /auth/refresh
const requestRefreshToken = async (req, res) => {
    const { idUser } = await req.body;
    try {
        const person = await User.findById(idUser);
        if (!person.refreshToken) {
            return res.status(401).json("You're not authenticated");
        }

        jwt.verify(person.refreshToken, process.env.JWT_REFRESH_KEY, async (err, user) => {
            if (err) {
                console.log(err);
            }

            const account = {
                _id: user.id,
                role: user.role
            }

            //create new access token, refresh token and send to user
            const newAccessToken = await generateAccessToken(account);
            const newRefreshToken = await generateRefreshToken(account);

            person.refreshToken = newRefreshToken;
            await person.save();

            return res.status(200).json(newAccessToken);
        });
    } catch (error) {
        return res.status(500).json(error);
    }
}

// [POST] /auth/signup
const signup = async (req, res) => {
    const { fullName, gender, email, username, password } = req.body;
    try {
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(409).json('email already registered');
        }

        const saltRounds = 10;
        const pwdHashed = await bcrypt.hash(password, saltRounds);
        const user = await User.create({ fullName, gender, email, username, password: pwdHashed });
        await CoursesStudent.create({ student: user._id });
        user.password = undefined;
        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json(error);
    }
}

// [POST] /auth/signin
const signin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json('user unregister');
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json('wrong password');
        }
        const accessToken = await generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);
        user.refreshToken = refreshToken;
        await user.save();

        user.password = undefined;
        user.refreshToken = undefined;
        user.__v = undefined;
        return res.status(200).json({ user, accessToken });
    } catch (error) {
        return res.status(500).json(error);
    }
}

// [POST] /auth/logout
const signout = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.refreshToken = undefined;
        await user.save();
        return res.status(200).json("Logged out !");
    } catch (error) {
        return res.status(500).json("Something wrong");
    }
}

// [POST] /auth/signup/teacher
const registerTeacher = async (req, res) => {
    const { fullName, gender, phone, email, username, password, avatar } = req.body;
    try {
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(409).json('email already registered');
        }

        const saltRounds = 10;
        const pwdHashed = await bcrypt.hash(password, saltRounds);
        const user = await User.create({ fullName, gender, phone, email, username, password: pwdHashed, avatar });
        user.role = 'Teacher';
        await user.save();

        user.password = undefined;
        await CoursesTeacher.create({ teacher: user._id });
        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json(error);
    }
}

export default {
    signup,
    signin,
    signout,
    requestRefreshToken,
    registerTeacher
}