require("dotenv").config();
const express = require('express');
const product = require('../models/product.Models');
const user = require('../models/user.Models')
const jwt = require("jsonwebtoken")
const session = require('express-session')
const bcrypt = require('bcrypt')
const md5 = require('md5')
const { patch, use } = require('../routers/product.router');
const app = express()


exports.ShopPage = async (req, res) => {
    const pageName = 'Shop Page';
    const cate = await product.category.find({});
    product.product.find({})
        .then(prod => {
            res.render('site/Shop', { prod, pageName, cate })
        }).catch(err => {
            if (err) throw err;
        })
}

exports.Detail = async (req, res) => {

    const pageName = 'Detail Page';

    const prod = await product.product.findById(req.params.id)
    res.render('site/productDetail', { prod: prod, pageName: pageName })
}

exports.GetByCate = async (req, res) => {
    const pageName = 'Shop Page';
    const cate = await product.category.find({});
    product.product.find({ cate: req.params.id })
        .then(prod => {
            res.render('site/Shop', { prod: prod, pageName: pageName, cate: cate })
        }).catch(err => {
            if (err) throw err;
        })
}

exports.searchProduct = async (req, res) => {
    const pageName = 'Shop Page';
    const searchString = req.body.searchString;
    searchString.toLowerCase();
    const cate = await product.category.find({});
    product.product.find({ productName: { $regex: searchString, $options: "$i" } })
        .then(prod => {
            res.render('site/Shop', { prod: prod, pageName: pageName, cate: cate, searchString: searchString })
        }).catch(err => {
            if (err) throw err;
        })
}

exports.Filter = async (req, res) => {
    const pageName = 'Shop Page';
    const cate = await product.category.find({});
    const prod = await product.product.find({ productPrice: { $lt: req.body.price } })
        .then(prod => {
            res.render('site/Shop', { prod: prod, cate: cate, pageName: pageName })
        }).catch(err => {
            if (err) throw err;
        })
}

exports.Login = async (req, res) => {
    const pageName = 'Login Page';
    const cate = await product.category.find({});
    product.product.find({})
        .then(prod => {
            res.render('site/login', { prod: prod, pageName: pageName, cate: cate })
        }).catch(err => {
            if (err) throw err;
        })
}

exports.Register = async (req, res) => {
    const pageName = 'Login Page';
    const cate = await product.category.find({});
    product.product.find({})
        .then(prod => {
            res.render('site/login', { prod: prod, pageName: pageName, cate: cate })
        }).catch(err => {
            if (err) throw err;
        })
}

exports.RegisterPost = (req, res) => {
    const hashpass = md5(req.body.password)
    const urs = user.user({
        username: req.body.username,
        userpassword: hashpass,
        fullName: req.body.fullname,
        address: req.body.address
    })

    urs.save((err) => {
        if (err) throw err;
        console.log('User is Created')
    })
    res.redirect('/login')
}

exports.LoginPost = async (req, res) => {
    const pageName = 'Shop Page';
    const hashpass = await md5(req.body.passwordlogin)
    const cate = await product.category.find({});
    const urs = await user.user.findOne({ username: req.body.usernamelogin, userpassword: hashpass }).lean();
    if (urs) {
        const token = jwt.sign(urs, process.env.SECRET_KEY)
        req.session.userToken=token
        res.redirect('/')
    }
    else {
        res.redirect('/login')
    }
}

exports.Logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        else {
            res.redirect('/login')
        }
    })
}

exports.UserList = (req, res) => {
    user.user.find({})
        .then(user => {
            res.render('admin/userList', { users: user })
        }).catch(err => {
            if (err) throw err;
        })
}
// test....
exports.Cart = async (req, res) => {
    const pageName = 'Cart Page';
    let total = 0;
    const cart = await user.cart.find({ user: req.session.user.username })

    if (req.session.user.username) {
        try {
            cart.forEach(item => {
                total += item.totalMoney
            })
        } catch (err) {
            console.log(err)
        }
        res.render('site/cart', { cart: cart, pageName: pageName, total: total })
    } else {
        res.redirect('/login')
    }
}

exports.AddtoCart = async (req, res) => {
    const prod = await product.product.findById(req.params.id)
    const totalItem = req.body.qtybutton * prod.productPrice
    var check = -1
    if (req.session.user) {
        let cart = await user.cart.find({ user: req.session.user.username })
        const cartItem = user.cart({
            productID: prod._id,
            product: prod.productName,
            quantity: req.body.qtybutton,
            totalMoney: totalItem,
            user: req.session.user.username
        })
        try {
            cart.forEach(item => {
                if (item.productID == req.params.id) {
                    check = 1
                    throw 'break-loop'
                }
                else check = -1
            });
        } catch (err) {
            console.log(err)
        }
        if (check < 0) {
            cartItem.save((err) => {
                if (err) throw err;
                else console.log('Cart is saved..')
            })
            
            res.redirect('/cart')
        } else {
            res.redirect('/')
        }
    }
    else res.redirect('/login')
}

exports.DeleteInCart = async (req, res) => {
    await user.cart.findOneAndRemove({ productID: req.params.id, user: req.session.user.username })
    const cart = await user.cart.find({ user: req.session.user.username })
    req.session.cart = cart;
    res.redirect('/cart')
}

exports.Checkout = async (req, res) => {
    let total = 0;
    const pageName = 'Checkout';
    const cart = await user.cart.find({ user: req.session.user.username })
    try {
        cart.forEach(item => {
            total += item.totalMoney
        })
    } catch (err) {
        console.log(err)
    }
    res.render('site/checkout', { cart: cart, pageName: pageName, total: total })
}

exports.SubmitCheckout = async (req, res) => {
    let total = 0;
    const usernow = await user.user.findOne({ username: req.session.user.username })
    let cart = await user.cart.find({ user: req.session.user.username })
    try {
        cart.forEach(item => {
            total += item.totalMoney
        })
    } catch (err) {
        console.log(err)
    }
    const order = user.order({
        username: req.session.user.username,
        fullName: usernow.fullName,
        address: usernow.address,
        total: total,
        status: 'Đang xử lý',
        order: cart
    })
    await order.save()
    await user.cart.remove({});

    res.redirect('/profile',)
}

exports.Profile = async (req, res) => {
    const pageName = 'Profile';
    const order = await user.order.find({
        username: req.session.user.username
    })
    console.log(order)
    res.render('site/profile', { pageName: pageName, order: order })
}


exports.OrderList = async (req, res) => {
    const order = await user.order.find({})
    let statuss = await user.orderstatus.find({})
    let list = []
    order.forEach(item => {
        if (item.status == 'Đang xử lý') {
             list.push('Đang giao', 'Đã giao', 'Hàng lỗi')
        }
        else {
            list = item.status
        }
        return list
    })
    res.render('admin/orderlist', { status: list, order: order })
}