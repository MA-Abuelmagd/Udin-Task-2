const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
    {
        id:{
            type: String,
            required: [true,"Please enter the ID of the product"],
            unique: true,
            index: true
        },
        name:{
            type: String,
            required: [true, "Please enter the name of the product"]
        },
        description:{
            type: String,
            required: false
        },
        price:{
            type:String,
            required: [true, "Please enter the price"]
        },
        quantity:{
            type: String,
            required: true,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model("Product",ProductSchema);

module.exports = Product;