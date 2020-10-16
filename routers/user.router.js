const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const controller = require('../controller/product.controller')
const multer = require('multer')({ dist: "/uploads" })
const usercontroller = require('../controller/user.controller')
const { user } = require('../models/user.Models')
const urlencodeParser = bodyParser.urlencoded({ extended: false })

router.get('/', usercontroller.ShopPage)
router.get('/productdetail/:id', usercontroller.Detail)

router.get('/category/:id', usercontroller.GetByCate)
router.post('/search', usercontroller.searchProduct)
router.post('/filter', usercontroller.Filter)

router.get('/login', usercontroller.Login)
router.post('/register', usercontroller.RegisterPost)
router.post('/login', usercontroller.LoginPost)
router.get('/logout', usercontroller.Logout)

router.get('/admin/userlist', usercontroller.UserList)

router.get('/cart',usercontroller.Cart)
router.post('/addtocart/:id',usercontroller.AddtoCart)
router.get('/delete/:id',usercontroller.DeleteInCart)
router.get('/checkout',usercontroller.Checkout)
router.get('/submitcheckout',usercontroller.SubmitCheckout)
router.get('/profile',usercontroller.Profile)
router.get('/admin/orderlist',usercontroller.OrderList)
module.exports = router;