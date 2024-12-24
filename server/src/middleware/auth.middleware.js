
import jwt from "jsonwebtoken"
const chechUser = async (req, res, next) => {
    const token = req.cookies.token;
    if (token) return res.status(400).json({ message: "please login first" })
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = user
        next()
    });
}

export default chechUser