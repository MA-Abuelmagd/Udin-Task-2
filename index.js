const express = require('express')
const mongoose = require('mongoose');
const app = express()
const Product = require('./models/product.model.js');
const { body, param, validationResult } = require('express-validator');

app.use(express.json())

app.listen(3000, () =>{
    console.log("Server is running on port 3000");
});
mongoose.connect("mongodb+srv://admin:admin1password@backenddb.sqkks.mongodb.net/Udin-API?retryWrites=true&w=majority&appName=BackendDB")
.then(()=>{
    console.log("Connected to database!")
})
.catch((err)=>{
    console.log(err)
});



app.get('/',(req,res)=>{
    res.send("Hello Udin Technical Test")
});

// Validation middleware for product ID
const validateProductId = [
    param('id').isInt({ gt: 0 }).notEmpty().withMessage('Product ID must be a positive integer')
];

// Validation middleware for product creation
const validateProductBodyForCreatingProduct = [
    body('id').isInt({ gt: 0 }).withMessage('Product ID must be a positive integer'),
    body('name').isString().notEmpty().withMessage('Product name is required and should be a string'),
    body('price').isFloat({ gt: 0 }).notEmpty().withMessage('Price must be a positive number'),
    body('quantity').isInt({ gt: 0 }).notEmpty().withMessage('Price must be a positive number')
];

const validateProductBody=[
    body('name').isString().optional().withMessage('Product name is required and should be a string'),
    body('price').isFloat({ gt: 0 }).optional().withMessage('Price must be a positive number'),
    body('quantity').isInt({ gt: 0 }).optional().withMessage('Price must be a positive number')
]



app.get('/getall',async (req,res)=>{
    try{
        const products = await Product.find({});
        res.status(200).json(products);
    }catch (error){
        res.status(500).json({message: error.message});
    }
})

app.get('/getproduct/:id',validateProductId, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
      const id = req.params.id;
      const product = await Product.findOne({id});
  
      if (!product) {
        console.log("Product not found!");
        res.status(404).json({ message: "Product not found! Make sure you entered the ID correctly" });
      } else {
        res.status(200).json(product);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Error fetching product" });
    }
});


app.post('/createProduct', validateProductBodyForCreatingProduct, async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try{
        const prod = await Product.create(req.body);
        res.status(200).json(prod);
    }catch(error){
        res.status(500).json({message: error.message});
    }
});


//update a Product

app.put('/updateproduct/:id', validateProductId, validateProductBody, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
      const id = req.params.id; // Directly access the ID parameter
      const product = await Product.findOneAndUpdate({id}, req.body);
  
      if (!product) {
        return res.status(404).json({ message: "Product not found! Make sure you entered the ID correctly" });
      }
      const updatedProduct = await Product.findOne({id});
      res.status(200).json(updatedProduct); // Return the updated product from findOneAndUpdate
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Error updating product" });
    }
});

//delete a Product

app.delete('/deleteproduct/:id', validateProductId, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
      const id = req.params.id;
      const product = await Product.findOneAndDelete({id});
  
      if (!product) {
        return res.status(404).json({ message: "Product not found! Make sure you entered the ID correctly" });
      }
  
      res.status(200).json({message: "Product Deleted Successfully"}); 
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Error updating product" });
    }
});

module.exports.default = app;