const express = require('express')
const mongoose = require('mongoose');
const app = express()
const Product = require('./models/product.model.js');

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

app.get('/getall',async (req,res)=>{
    try{
        const products = await Product.find({});
        res.status(200).json(products);
    }catch (error){
        res.status(500).json({message: error.message});
    }
})

app.get('/getproduct/:id', async (req, res) => {
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


app.post('/createProduct', async (req,res)=>{
    try{
        const prod = await Product.create(req.body);
        res.status(200).json(prod);
    }catch(error){
        res.status(500).json({message: error.message});
    }
});


//update a Product

app.put('/updateproduct/:id', async (req, res) => {
    try {
      const id = req.params.id; // Directly access the ID parameter
      const product = await Product.findOneAndUpdate({id}, req.body);
  
      if (!product) {
        return res.status(404).json({ message: "Product not found! Make sure you entered the ID correctly" });
      }
  
      res.status(200).json(product); // Return the updated product from findOneAndUpdate
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Error updating product" });
    }
});

//delete a Product

app.delete('/deleteproduct/:id', async (req, res) => {
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