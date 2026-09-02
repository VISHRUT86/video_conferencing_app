import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Meeting } from "../models/meeting.model.js";


const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required"
            });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        const token = crypto.randomBytes(32).toString("hex");

        user.token = token;
        await user.save();

        return res.status(200).json({
            token
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);

        return res.status(500).json({
            message: "Login failed"
        });
    }
};


const register = async (req, res) => {
    try {
        const { name, username, password } = req.body;

        if (!name || !username || !password) {
            return res.status(400).json({
                message: "Name, username and password are required"
            });
        }

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            username,
            password: hashedPassword
        });

        await newUser.save();

        return res.status(201).json({
            message: "User Registered"
        });

    } catch (error) {
        console.error("REGISTER ERROR:", error);

        return res.status(500).json({
            message: "Registration failed"
        });
    }
};


const getUserHistory = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(401).json({
                message: "Token is required"
            });
        }

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(401).json({
                message: "Invalid user"
            });
        }

        const meetings = await Meeting.find({
            user_id: user.username
        });

        return res.status(200).json(meetings);

    } catch (error) {
        console.error("GET HISTORY ERROR:", error);

        return res.status(500).json({
            message: "Failed to fetch meeting history"
        });
    }
};


const addToHistory = async (req, res) => {
    try {
        const { token, meeting_code } = req.body;

        if (!token || !meeting_code) {
            return res.status(400).json({
                message: "Token and meeting code are required"
            });
        }

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(401).json({
                message: "Invalid user"
            });
        }

        const newMeeting = new Meeting({
            user_id: user.username,
            meetingCode: meeting_code
        });

        await newMeeting.save();

        return res.status(201).json({
            message: "Added code to history"
        });

    } catch (error) {
        console.error("ADD HISTORY ERROR:", error);

        return res.status(500).json({
            message: "Failed to add meeting history"
        });
    }
};


export {
    login,
    register,
    getUserHistory,
    addToHistory
};
