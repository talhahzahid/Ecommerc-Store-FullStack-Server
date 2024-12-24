import express from "express"
import { postAds } from "../controllers/product.controllers.js"
import { upload } from "../middleware/multer.middleware.js"

const router = express.Router()

router.post('/productpost', upload.single('image'), postAds)


export default router