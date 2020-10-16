require('dotenv').config()
const jwt = require("jsonwebtoken")
const user = require('./models/user.Models')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const router = express.Router()
const session = require('express-session')
const bodyParser = require('body-parser')
const urlencodeParser = bodyParser.urlencoded({ extended: false })
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const path = require('path');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/uploads'));
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 } }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const token = req.session.userToken
  const data = token ? jwt.decode(token, process.env.SECRET_KEY) : undefined
  req.session.user = data
  next()
})

app.use(async function (req, res, next) {
  res.locals.user = req.session.user;
  const cart = req.session.user ? await user.cart.find({ user: req.session.user.username }) : []
  res.locals.cart = cart;
  req.session.cart = cart;
  next();
});

const product = require('./routers/product.router')
const client = require('./routers/user.router')
const { use } = require('./routers/product.router')

app.use(product)
app.use(client)

module.exports=app
// app.listen(process.env.PORT || 8000, () => console.log(`server is running on ${process.env.PORT}`))