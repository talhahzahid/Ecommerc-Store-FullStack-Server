import express from "express"
import { allAds, postAds } from "../controllers/product.controllers.js"
import { upload } from "../middleware/multer.middleware.js"

const router = express.Router()

router.post('/productpost', upload.single('image'), postAds)
router.get('/all',  allAds)


export default router