// require = require('esm')(module);
const request = require('supertest');
const { expect } = require('chai');
const express = require('express');
const mongoose = require('mongoose');
const app = require('../index.js');
const Product = require('../models/product.model.js');

describe('Product API', function() {
    this.timeout(10000); // Increase timeout if needed

    before(async function() {
        // Connect to the test database
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect('mongodb+srv://admin:admin1password@backenddb.sqkks.mongodb.net/Udin-API-test?retryWrites=true&w=majority&appName=BackendDB'
                , { useNewUrlParser: true, useUnifiedTopology: true });
        }
    });

    beforeEach(async function() {
        // Clear the products collection
        await Product.deleteMany({}); // Use async/await for deleteMany
    });

    after(async function() {
        // Close the connection after tests
        await mongoose.connection.close(); // Ensure mongoose connection is closed
    });

    it('should return a welcome message', async function() {
        const response = await request(app).get('/');
        expect(response.status).to.equal(200);
        expect(response.text).to.equal('Hello Udin Technical Test');
    });

    describe('GET /getall', function() {
        it('should return an empty array initially', function(done) {
            request(app)
                .get('/getall')
                .expect(200)
                .expect('Content-Type', /json/)
                .expect([], done);
        });
    });

    describe('POST /createProduct', function() {
        it('should create a new product', async function(done) {
            const newProduct = {
                id: 1,
                name: 'Sample Product',
                price: 10.00,
                quantity: 100
            };
            
            await request(app)
                .post('/createProduct')
                .send(newProduct)
                .expect(200)
                .expect('Content-Type', /json/)
                .expect(res => {
                    if (res.body.name !== newProduct.name) throw new Error('Product name mismatch');
                    if (res.body.price !== newProduct.price) throw new Error('Product price mismatch');
                    if (res.body.quantity !== newProduct.quantity) throw new Error('Product quantity mismatch');
                })
                .end(done);
        });

        it('should return a validation error for missing fields', async function(done) {
            const invalidProduct = {
                id: 2,
                name: '', // Missing name
                price: -10.00, // Invalid price
                quantity: 'invalid' // Invalid quantity
            };
            
            await request(app)
                .post('/createProduct')
                .send(invalidProduct)
                .expect(400)
                .expect('Content-Type', /json/)
                .expect(res => {
                    if (!res.body.errors) throw new Error('Expected validation errors');
                })
                .end(done);
        });
    });

    describe('GET /getproduct/:id', async function() {
        it('should return a product by ID', async function(done) {
            const newProduct = new Product({
                id: 1,
                name: 'Test Product',
                price: 20.00,
                quantity: 50
            });
            
            await newProduct.save().then(() => {
                 request(app)
                    .get('/getproduct/1')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        if (res.body.name !== 'Test Product') throw new Error('Product name mismatch');
                    })
                    .end(done);
            });
        });

        it('should return 404 for non-existing product', async function(done) {
            await request(app)
                .get('/getproduct/999')
                .expect(404)
                .expect('Content-Type', /json/)
                .expect(res => {
                    if (res.body.message !== 'Product not found! Make sure you entered the ID correctly') throw new Error('Error message mismatch');
                })
                .end(done);
        });
    });

    describe('PUT /updateproduct/:id', function() {
        it('should update a product by ID', async function(done) {
            const newProduct = new Product({
                id: 1,
                name: 'Original Product',
                price: 30.00,
                quantity: 200
            });

            await newProduct.save().then(() => {
                const updatedProduct = {
                    name: 'Updated Product',
                    price: 35.00,
                    quantity: 150
                };

                request(app)
                    .put('/updateproduct/1')
                    .send(updatedProduct)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        if (res.body.name !== 'Updated Product') throw new Error('Product name mismatch');
                        if (res.body.price !== 35.00) throw new Error('Product price mismatch');
                        if (res.body.quantity !== 150) throw new Error('Product quantity mismatch');
                    })
                    .end(done);
            });
        });

        it('should return a validation error for invalid update fields', async function(done) {
            await request(app)
                .put('/updateproduct/1')
                .send({ price: -5.00 }) // Invalid price
                .expect(400)
                .expect('Content-Type', /json/)
                .expect(res => {
                    if (!res.body.errors) throw new Error('Expected validation errors');
                })
                .end(done);
        });
    });

    describe('DELETE /deleteproduct/:id', function() {
        it('should delete a product by ID', async function(done) {
            const newProduct = new Product({
                id: 1,
                name: 'Product to Delete',
                price: 40.00,
                quantity: 10
            });

            await newProduct.save().then(() => {
                request(app)
                    .delete('/deleteproduct/1')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        if (res.body.message !== 'Product Deleted Successfully') throw new Error('Deletion message mismatch');
                    })
                    .end(done);
            });
        });

        it('should return 404 for non-existing product', async function(done) {
            await request(app)
                .delete('/deleteproduct/999')
                .expect(404)
                .expect('Content-Type', /json/)
                .expect(res => {
                    if (res.body.message !== 'Product not found! Make sure you entered the ID correctly') throw new Error('Error message mismatch');
                })
                .end(done);
        });
    });
});
