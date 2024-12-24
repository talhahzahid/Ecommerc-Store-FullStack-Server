
import users from "../models/user.models.js";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
dotenv.config();

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const generateTokenFromUser = (user) => {
    return jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "3d"
    })
}

const uploadImageToCloudinary = async (localpath) => {
    // console.log("Uploading image from path:", localpath);
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    try {
        const uploadResult = await cloudinary.uploader.upload(localpath, {
            resource_type: "auto",
        });
        console.log("Cloudinary upload result:", uploadResult);
        await fs.promises.unlink(localpath);
        return uploadResult.url;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        await fs.promises.unlink(localpath);
        return null;
    }
};

// user signup form 
const userRegister = async (req, res) => {
    const { fullname, email, password } = req.body;
    if (!fullname) return res.status(400).json({ message: "Fullname is required" });
    if (!email) return res.status(400).json({ message: "Email is required" });
    if (!password) return res.status(400).json({ message: "Password is required" });
    if (!req.file) return res.status(400).json({ message: "Image is required" });

    try {
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        // Upload image to Cloudinary
        const imageUrl = await uploadImageToCloudinary(req.file.path);
        if (!imageUrl) return res.status(400).json({ message: "Failed to upload image to Cloudinary" });

        // Create a new user
        const user = await users.create({ fullname, email, password, imageUrl });

        // Respond with the new user
        res.status(200).json({ message: "User registered successfully", data: user });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "An error occurred", error: error.message });
    }
};

// user login form 
const userLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
    if (!password) return res.status(400).json({ message: "Password is required" });
    try {
        // chech user email 
        const user = await users.findOne({ email })
        if (!user) return res.status(400).json({ message: 'user no found' })
        // check user password 
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) return res.status(400).json({ message: "incorrect password" })
        // generate token from user 
        const token = generateTokenFromUser(user)
        res.cookie("Token", token, { httpOnly: true, sameSite: "None", secure: true });
        res.status(200).json({ message: "Login successfully", token })
    } catch (error) {
        res.status(400).json({ message: "error occurred" })
    }
}

// user logout form 
const userLogout = async (req, res) => {
    try {
        res.clearCookie("Token", { httpOnly: true, sameSite: "None", secure: true })
        res.status(200).json({ message: "Logout successfully" });
    } catch (error) {
        res.status(500).json({ message: "An error occurred, please try again later" });
    }
};


export { userRegister, userLogin, userLogout };
