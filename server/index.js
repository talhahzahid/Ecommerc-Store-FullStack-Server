import dotenv from "dotenv"
dotenv.configDotenv()
import express, { urlencoded } from "express"
const app = express()
const port = process.env.PORT
import userRouter from "./src/routes/user.routes.js"
import connectdb from "./src/db/index.js"
import cookieParser from "cookie-parser"


app.use(urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())

app.use('/user', userRouter)
app.get('/', (req, res) => {
    res.send("Ecommerce")
})



connectdb()
    .then(() => {
        app.listen(port, () => {
            console.log("server is running at port", port)
        })
    })
    .catch((err) => {
        console.log(err);
    })