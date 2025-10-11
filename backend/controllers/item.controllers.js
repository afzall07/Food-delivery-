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
        shop.items.push(item._id)
        await shop.save()
        await shop.populate("owner")
        await shop.populate({
            path: "items",
            options: { sort: { updatedAt: -1 } }
        })
        return res.status(201).json(shop)
    } catch (error) {
        return res.status(500).json({ message: `Item add error ${error}` })
    }
}

export const editItem = async (req, res) => {
    try {
        const itemId = req.params.itemId
        const { name, price, category, foodType } = req.body
        let image;
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path)
        }
        const item = await Item.findByIdAndUpdate(itemId, {
            name, price, category, foodType, image
        }, { new: true })
        if (!item) {
            return res.status(400).json({ message: `Item not found` })
        }
        const shop = await Shop.findOne({ owner: req.userId }).populate({
            path: "items",
            options: { sort: { updatedAt: -1 } }
        })
        return res.status(200).json(shop)
    } catch (error) {
        return res.status(500).json({ message: `Item edit error ${error}` })
    }
}

export const getItemById = async (req, res) => {
    try {
        const itemId = req.params.itemId;
        const item = await Item.findById(itemId)
        if (!item) {
            return res.status(400).json({ message: `Item not found` })
        }
        return res.status(200).json(item)
    } catch (error) {
        return res.status(500).json({ message: `get Item error ${error}` })
    }
}

export const deleteItem = async (req, res) => {
    try {
        const itemId = req.params.itemId
        const item = await Item.findByIdAndDelete(itemId)
        if (!item) {
            return res.status(400).json({ message: "Item not found" })
        }
        const shop = await Shop.findOne({ owner: req.userId })
        shop.items = shop.items.filter(i => i !== item._id)
        await shop.save()
        await shop.populate({
            path: "items",
            options: { sort: { updatedAt: -1 } }
        })
        return res.status(200).json(shop)
    } catch (error) {
        return res.status(500).json({ message: `delete Item error ${error}` })

    }
}

export const getItemByCity = async (req, res) => {
    try {
        const { city } = req.params
        if (!city) {
            return res.status(400).json({ message: "city is required" })
        }
        const shops = await Shop.find({ city: { $regex: new RegExp(`^${city}$`, "i") } }).populate("items")
        if (!shops) {
            return res.status(400).json({ message: "shops not found" })
        }
        const shopIds = shops.map((shop) => shop._id)
        const items = await Item.find({ shop: { $in: shopIds } })
        return res.status(200).json(items)
    } catch (error) {
        return res.status(500).json({ message: `get item by city error ${error}` })

    }
}