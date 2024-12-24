import express from "express"
import { userLogin, userLogout, userRegister } from "../controllers/user.controllers.js"
import { upload } from "../middleware/multer.middleware.js"

const router = express.Router()

router.post('/signup', upload.single('image'), userRegister)
router.post('/signin', userLogin)
router.get('/logout', userLogout)

export default router