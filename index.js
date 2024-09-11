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





