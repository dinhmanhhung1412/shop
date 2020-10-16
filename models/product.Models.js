const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CategorySchema = new Schema({
    cateName:{
        type:String,
        required:true
    },
    createdDate:{
        type: Date,
    }
})

const ProductSchema = new Schema({
    productName: {
        type: String,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    productDesc: {
        type: String
    },
    productImage: {
        type: String
    },
    cate: {type:String}
});


module.exports.product = mongoose.model('Product', ProductSchema);
module.exports.category = mongoose.model('Category', CategorySchema);
