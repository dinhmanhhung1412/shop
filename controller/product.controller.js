const express = require('express');
const product = require('../models/product.Models');
const { patch } = require('../routers/product.router');
const app = express()
const fs = require('fs')


exports.Shop = (req, res) => {
    res.render('site/Shop')
}

exports.AdminHome = (req, res) => {
    res.render('admin/home')
}

exports.CreateCate = (req, res) => {
    product.category.find({}).
        then(cate => {
            res.render('admin/createCategory', { cate: cate })
        })
        .catch(err => {
            console.log('err: ', err);
            throw err;
        });

}

exports.CreateCatePost = (req, res) => {
    const cate = new product.category({
        cateName: req.body.name,
        createdDate: Date.now()
    })
    cate.save((err) => {
        if (err) throw err;
        console.log('Category is Created ..');
    })
    res.redirect('/createcategory')
}

exports.EditCategory = (req, res) => {
    product.category.findOneAndUpdate({
        _id: req.body.id
    }, { $set: { cateName: req.body.editname } }, { new: true }, (err) => {
        if (err) {
            console.log('fail');
        }
    })
}

exports.DeleteCategory = (req, res) => {
    product.category.findByIdAndRemove(req.params.id, (err) => {
        if (err) throw err;
    })
    res.redirect('/createcategory')
}

exports.CreateProduct = (req, res) => {
    product.category.find({})
        .then(cate => {
            res.render('admin/createProduct', { cate: cate })
        }).catch(err => {
            if (err) throw err;
        })
}

exports.CreateProductPost = (req, res) => {

    if (!fs.existsSync("uploads/")) {
        fs.mkdirSync("uploads")
    }
    console.log(req.file);
    fs.readFile(req.file.path,(err,data)=>{
        fs.writeFileSync(`uploads/${req.file.originalname}`, data)
    })

    const prod = product.product({
        productName: req.body.productname,
        productPrice: req.body.productprice,
        productDesc: req.body.productdescription,
        productImage: `uploads/${req.file.originalname}`,
        cate: req.body.cate
    })
    prod.save((err) => {
        if (err) throw err
        console.log("Product is Created ..");
    })
    res.redirect('/productlist')
}

exports.ProductList = (req, res) => {
    product.product.find({})
        .then(prod => {
            res.render('admin/productList', { prod: prod })
        }).catch(err => {
            if (err) throw err
        })
}


exports.UpdateProduct = async (req, res) => {

    const cate = await product.category.find({});
    product.product.findOne({ _id: req.params.id })
        .then(prod => {
            res.render('admin/updateProduct', { prod: prod, cate: cate })
        }).catch(err => {
            if (err) throw err;
        })
}

exports.UpdateProductPost = (req, res) => {
    if (!fs.existsSync("uploads/")) {
        fs.mkdirSync("uploads")
    }
    fs.writeFileSync(`uploads/${req.file.originalname}`, req.file.buffer.toString())

    product.product.findOneAndUpdate(
        { _id: req.params.id },
        {
            $set: {
                productName: req.body.productname,
                productPrice: req.body.productprice,
                productDesc: req.body.productdescription,
                productImage: req.file.originalname,
                cate: req.body.cate
            }
        },
        { new: true }, (err) => {
            if (err) throw err;
            console.log(req.params.id)
        })
    res.redirect('/productlist')
}

exports.DeleteProduct = (req, res) => {
    product.product.findByIdAndRemove(req.params.id, (err) => {
        if (err) throw err;
    })
    res.redirect('/productlist')
}

