import Shop from '../models/shop.model.js';
import uploadOnCloudinary from '../utils/cloudinary.js';

export const createEditShop = async (req, res) => {
    try {
        const { name, city, state, address } = req.body;
        let image;

        if (req.file) {
            image = await uploadOnCloudinary(req.file.path);
        }

        let shop = await Shop.findOne({ owner: req.userId })
        if (!shop) {
            // Shop create
            shop = await Shop.create({
                name,
                city,
                state,
                address,
                image,
                owner: req.userId
            });
        } else {
            // Shop update
            shop = await Shop.findByIdAndUpdate(shop._id, {
                name,
                city,
                state,
                address,
                image,
                owner: req.userId
            }, { new: true });
        }


        await shop.populate('owner');

        return res.status(201).json(shop);
    } catch (error) {
        console.error("Create Shop error:", error);
        return res.status(500).json({ message: "Failed to create shop", error: error.message });
    }
};

export const getShop = async (req, res) => {
    try {
        const shop = await Shop.findOne({ owner: req.userId }).populate("owner items")
        if (!shop) {
            return null
        }
        return res.status(200).json(shop)
    } catch (error) {
        return res.status(500).json({ message: `get my shop error ${error}` })
    }
}
