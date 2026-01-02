import User from '../models/user.model.js'
export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId
        if (!userId) {
            return res.status(400).json({ message: "userId not found" })
        }
        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: `get current user error ${error}` })
    }
}

export const updateUserLocation = async (req, res) => {
    try {
        const { lat, long } = req.body;
        const latitude = parseFloat(lat);
        const longitude = parseFloat(long);

        if (isNaN(latitude) || isNaN(longitude)) {
            console.error("COORDINATE CHECK FAILED: NaN found. Input body:", req.body);
            return res.status(400).json({
                success: false,
                message: "Invalid latitude or longitude value provided."
            });
        }


        const updateData = {
            location: {
                type: 'Point',
                coordinates: [longitude, latitude] // [Long, Lat] 
            }
        };


        const user = await User.findByIdAndUpdate(req.userId, updateData, { new: true });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "Location updated successfully" });

    } catch (error) {
        console.error("update user location Error:", error);
        return res.status(500).json({
            success: false,
            message: `Internal Server Error while updating user location. Details: ${error.message}`
        });
    }
}