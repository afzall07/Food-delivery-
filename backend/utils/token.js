import jwt from 'jsonwebtoken'

const genToken = async (userId) => {
    try {
        const token = await jwt.sign(userId, process.env.JWT_SECERET, { expiresIn: "7d" })
    } catch (error) {
        console.log(error)
    }
}

export default genToken