const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const controller = require('../controller/product.controller')
const multer = require('multer')({ dest: "/uploads" })
const usercontroller = require('../controller/user.controller')
const urlencodeParser = bodyParser.urlencoded({ extended: false })

router.get('/admin', controller.AdminHome)
router.get('/createcategory', controller.CreateCate)
router.post('/createcategory', controller.CreateCatePost)
router.get('/deletecategory/:id', controller.DeleteCategory)


router.get('/createproduct', controller.CreateProduct)
router.post('/createproduct', multer.single('image'), controller.CreateProductPost)
router.get('/productlist', controller.ProductList)
router.get('/deleteproduct/:id', controller.DeleteProduct)
router.get('/updateproduct/:id', controller.UpdateProduct)
router.post('/updateproduct/:id', multer.single('image'), controller.UpdateProductPost)


module.exports = router;