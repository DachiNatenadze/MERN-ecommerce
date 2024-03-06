import UserModel from '../models/User.js'
import AdminModel from '../models/Admin.js'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

export const registerController = async (req, res) => {
  const { email, password, username, gender } = req.body

  const hashedPassword = await bcrypt.hash(password, 10)

  const dupEmail = await UserModel.findOne({ email })
  const dupUsername = await UserModel.findOne({ username })

  if (dupEmail || dupUsername) {
    return res.status(400).json({ message: 'This user already exists' })
  }

  await UserModel.create({
    email: email,
    username: username,
    password: hashedPassword,
    gender: gender,
  })

  jwt.sign({ username, email }, process.env.JWT_SECRET, {}, (err, token) => {
    if (err) {
      return res.status(400).json({ message: 'Something went wrong' })
    }
    res.cookie('token', token).status(200).json({
      message: 'U have successfully created an account',
    })
  })
}

export const loginController = async (req, res) => {
  const { email, password } = req.body

  const existsUser = await UserModel.findOne({ email })
  if (!existsUser) {
    return res
      .status(400)
      .json({ message: 'User with this email does`t exist' })
  }
  const passwordMatched = await bcrypt.compare(password, existsUser.password)
  if (passwordMatched) {
    jwt.sign(
      { email, username: existsUser.username },
      process.env.JWT_SECRET,
      {},
      (err, token) => {
        if (err)
          return res.status(500).json({ message: 'Internal server error' })
        res.cookie('token', token).json({ existsUser })
      }
    )
  } else {
    res.status(400).json({ message: 'password is incorrect' })
  }
}

export const getProfileController = (req, res) => {
  const { token } = req.cookies
  if (!token) {
    return res.status(401).json({ message: 'User is unauthorized' })
  }
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, token) => {
    const { email } = token
    const loggerUser = await UserModel.findOne({ email })

    if (loggerUser) {
      res
        .status(200)
        .json({ username: loggerUser.username, email: loggerUser.email })
    }
  })
}

export const logoutUser = (req, res) => {
  const { token } = req.cookies
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized request' })
  }
  res
    .cookie('token', '')
    .status(200)
    .json({ message: 'User has successfully logged out' })
}

export const uploadProductAdmin = async (req, res) => {
  const {
    productTitle,
    productDescription,
    productImage,
    productPrice,
    productColor,
    productType,
  } = req.body

  if (
    !productTitle ||
    !productDescription ||
    !productImage ||
    !productColor ||
    !productPrice
  ) {
    return res.status(400).json({ message: 'Please fill out all fields' })
  }

  const createdProduct = await AdminModel.create({
    title: productTitle,
    description: productDescription,
    image: productImage,
    price: productPrice,
    color: productColor,
    type: productType,
  })
  res.status(200).json(createdProduct)
}

export const getAllArrivals = async (req, res) => {
  const products = await AdminModel.find({}).sort({ createdAt: -1 })
  if (!products) {
    return res
      .status(500)
      .json({ message: 'Internal server error: problem fetching products' })
  }
  res.status(200).json(products)
}
