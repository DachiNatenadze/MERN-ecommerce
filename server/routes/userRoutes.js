import express from 'express'
const router = express.Router()
import {
  registerController,
  getProfileController,
  uploadProductAdmin,
  getAllArrivals,
  logoutUser,
  loginController,
} from '../controllers/userController.js'

router.get('/get-arrivals', getAllArrivals)
router.get('/account', getProfileController)
router.post('/register', registerController)
router.post('/login', loginController)
router.post('/product-admin', uploadProductAdmin)
router.post('/logout', logoutUser)

export default router
