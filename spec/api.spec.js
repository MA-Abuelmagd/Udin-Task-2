const axios = require('axios');
const mongoose = require('mongoose');
const Product = require('../models/product.model.js');
const { Server } = require('http');

const mongoURI = "mongodb+srv://admin:admin1password@backenddb.sqkks.mongodb.net/Udin-API?retryWrites=true&w=majority&appName=BackendDB";
let app;
let server;

beforeAll(async () => {
    try {
        // Connect to the database
        mongoose.connect(mongoURI).then()
        .catch((err) => {
            console.error(`Database connection error: ${err.message}`);
        });

        // Import the Express app
        app = require('../index.js').default;

        // Start server
        server = app.listen(3001);

        // Ensure server is listening
        await new Promise((resolve, reject) => {
            server.on('listening', resolve);
            server.on('error', reject);
        });
    } catch (error) {
        fail(`Before hook failed: ${error.message}`);
    }
});

beforeEach(async () => {
    try {
        // Clear the products collection
        await Product.deleteMany({});
    } catch (error) {
        fail(`BeforeEach hook failed: ${error.message}`);
    }
});

afterAll(async () => {
    try {
        // Close database connection
        await mongoose.connection.close();

        // Close server
        if (server) {
            server.close();
        }
    } catch (error) {
        fail(`After hook failed: ${error.message}`);
    }
});

describe('Product API', () => {
    //test the initial connection
    it('should return a welcome message', async () => {
        try {
            const response = await axios.get('http://localhost:3001/');
            expect(response.status).toBe(200);
            expect(response.data).toBe('Hello Udin Technical Test');
        } catch (error) {
            fail(`Test failed: ${error.message}`);
        }
    });

    //test that the database is actually empty at the beignning
    it('GET /getall should return an empty array initially', async () => {
        try {
            const response = await axios.get('http://localhost:3001/getall');
            expect(response.status).toBe(200);
            expect(response.data).toEqual([]);
        } catch (error) {
            fail(`Test failed: ${error.message}`);
        }
    });

    //test to create a product successfully
    it('POST /createProduct should create a new product', async () => {
        const newProduct = {
            id: 1,
            name: 'Sample Product',
            price: 10.00,
            quantity: 100
        };

        try {
            const response = await axios.post('http://localhost:3001/createProduct', newProduct);
            expect(response.status).toBe(200);
            // Destructure to remove MongoDB specific fields
            const { _id, createdAt, updatedAt, __v, ...rest } = response.data;

            // Assert the remaining properties
            expect(rest).toEqual(newProduct);
        } catch (error) {
            fail(`Test failed: ${error.message}`);
        }
    });

    //test to create a product but here we are testing the validation middleware
    //so we are passing with missing fields
    it('POST /createProduct should return a validation error for missing fields', async () => {
        const invalidProduct = {
            id: 2,
            name: '', // Missing name
            price: -10.00, // Invalid price
            quantity: 'invalid' // Invalid quantity
        };

        try {
            await axios.post('http://localhost:3001/createProduct', invalidProduct);
            fail('Expected validation error not thrown');
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data.errors).toBeDefined();
        }
    });

    //test to get a product with a specific ID
    it('GET /getproduct/:id should return a product by ID', async () => {
        const newProduct = new Product({
            id: 1,
            name: 'Test Product',
            price: 20.00,
            quantity: 50
        });

        await newProduct.save();

        try {
            const response = await axios.get('http://localhost:3001/getproduct/1');
            expect(response.status).toBe(200);
            expect(response.data.name).toBe('Test Product');
        } catch (error) {
            fail(`Test failed: ${error.message}`);
        }
    });

    //test to get a product with wrong ID
    it('GET /getproduct/:id should return 404 for non-existing product', async () => {
        try {
            await axios.get('http://localhost:3001/getproduct/999');
            fail('Expected 404 not returned');
        } catch (error) {
            expect(error.response.status).toBe(404);
            expect(error.response.data.message).toBe('Product not found! Make sure you entered the ID correctly');
        }
    });

    //test to update a product correctly
    it('PUT /updateproduct/:id should update a product by ID', async () => {
        const newProduct = new Product({
            id: 1,
            name: 'Original Product',
            price: 30.00,
            quantity: 200
        });

        await newProduct.save();

        const updatedProduct = {
            name: 'Updated Product',
            price: 35.00,
            quantity: 150
        };

        try {
            const response = await axios.put('http://localhost:3001/updateproduct/1', updatedProduct);
            expect(response.status).toBe(200);
            expect(response.data.name).toBe('Updated Product');
            expect(response.data.price).toBe(35.00);
            expect(response.data.quantity).toBe(150);
        } catch (error) {
            fail(`Test failed: ${error.message}`);
        }
    });

    //test to update a product with invalid input fields (testing the validation middleware)
    it('PUT /updateproduct/:id should return a validation error for invalid update fields', async () => {
        try {
            await axios.put('http://localhost:3001/updateproduct/1', { price: -5.00 }); // Invalid price
            fail('Expected validation error not thrown');
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data.errors).toBeDefined();
        }
    });
    //test to update a product with wrong ID
    it('PUT /updateproduct/:id should return 404 for non-existing product', async () => {
        try {
            await axios.put('http://localhost:3001/updateproduct/999');
            fail('Expected 404 not returned');
        } catch (error) {
            expect(error.response).toBeDefined();
            expect(error.response.status).toBe(404);
            expect(error.response.data.message).toBe('Product not found! Make sure you entered the ID correctly');
        }
    });
    
    //test to delete a product from the DB with correct ID
    it('DELETE /deleteproduct/:id should delete a product by ID', async () => {
        const newProduct = new Product({
            id: 1,
            name: 'Product to Delete',
            price: 40.00,
            quantity: 10
        });

        await newProduct.save();

        try {
            const response = await axios.delete('http://localhost:3001/deleteproduct/1');
            expect(response.status).toBe(200);
            expect(response.data.message).toBe('Product Deleted Successfully');
        } catch (error) {
            fail(`Test failed: ${error.message}`);
        }
    });


    //test to delete a product with wrong ID
    it('DELETE /deleteproduct/:id should return 404 for non-existing product', async () => {
        try {
            await axios.delete('http://localhost:3001/deleteproduct/999');
            fail('Expected 404 not returned');
        } catch (error) {
            expect(error.response.status).toBe(404);
            expect(error.response.data.message).toBe('Product not found! Make sure you entered the ID correctly');
        }
    });

});
