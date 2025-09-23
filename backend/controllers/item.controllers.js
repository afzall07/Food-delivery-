import uploadOnCloudinary from '../utils/cloudinary.js'
import Shop from '../models/shop.model.js'
import Item from '../models/item.model.js'

export const addItem = async (req, res) => {
    try {
        const { name, price, category, foodType } = req.body
        let image;
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path)
        }

        const shop = await Shop.findOne({ owner: req.userId })
        if (!shop) {
            return res.status(400).json({ message: `Shop not found` })
        }

        const item = await Item.create({
            name, price, category, foodType, image, shop: shop._id
        })
        return res.status(201).json(item)
    } catch (error) {
        return res.status(500).json({ message: `Item add error ${error}` })
    }
}