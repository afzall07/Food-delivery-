import jwt from 'jsonwebtoken'
const isAuth = async (req, res) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(400).json({ message: "token not found" })
        }
        const decodeToken = jwt.verify(token, process.env.JWT_SECERET)
        if (!decodeToken) {
            res.status(400).json({ message: "token not verify" })
        }
        console.log(decodeToken)
        req.userId = decodeToken.userId
        next()
    } catch (error) {
        return res.status(500).json({ message: "isAuth error" })
    }
}