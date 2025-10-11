import express from 'express'
import { createEditShop, getShop, getShopByCity } from '../controllers/shop.controllers.js'
import { isAuth } from '../middlewares/isAuth.js'
import { upload } from '../middlewares/multer.js'

const shopRouter = express.Router()
shopRouter.post('/create-edit', isAuth, upload.single("image"), createEditShop)
shopRouter.get('/get-my', isAuth, getShop)
shopRouter.get('/get-by-city/:city', isAuth, getShopByCity)
export default shopRouter