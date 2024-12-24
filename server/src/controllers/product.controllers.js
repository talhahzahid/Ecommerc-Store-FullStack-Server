

import dotenv from "dotenv"
import product from "../models/product.models.js"
import users from "../models/user.models.js"
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
dotenv.config()

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


const postAds = async (req, res) => {
    const { userId, productName, description, price, category } = req.body;
    if (!userId) return res.status(400).json({ message: "id is required to post ads" })
    if (!productName) return res.status(400).json({ message: "productName is required to post ads" })
    if (!description) return res.status(400).json({ message: "description is required to post ads" })
    if (!price) return res.status(400).json({ message: "price is required to post ads" })
    if (!category) return res.status(400).json({ message: "category is required to post ads" })
    if (!req.file) return res.status(400).json({ message: "product image is required" })
    try {
        const productImgUrl = await uploadImageToCloudinary(req.file.path)
        if (!productImgUrl) return res.status(400).json({ message: "product image is required" })
        console.log("hello ", productImgUrl);

        const productPost = await product.create({ userId, productName, description, price, category, productImgUrl })
        console.log(productPost);
        
        res.status(201).json({ message: "Product posted successfully", product: productPost });

    } catch (error) {
        res.status(400).json({ message: "error occurred" })
    }
}

export { postAds }