# Product API

## Overview

**The Product API** is a Node.js application that provides a RESTful API for managing products. It uses Express for routing and MongoDB with Mongoose for data storage and management. This application includes endpoints for creating, retrieving, updating, and deleting products.

## Prerequisites

To get started, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 14 or higher is recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [yarn](https://classic.yarnpkg.com/en/) (optional)

## Getting Started
### Install Dependencies:
Install the required dependencies using npm:
```npm
npm install
```

### Run the Application
Start the application with the following command:
```npm
npm run dev
```

The server will run on port 3000 by default. You can access it at http://localhost:3000.

### API Endpoints
The following endpoints are available:

- **GET /**: Returns a welcome message.
- **GET /getall**: Retrieves all products.
- **GET /getproduct/**: Retrieves a product by its ID. The ID must be a positive integer.
- **POST /createProduct**: Creates a new product. The request body must include id, name, price, and quantity.
- **PUT /updateproduct/**: Updates a product by its ID. The request body can include name, price, and quantity (optional).
- **DELETE /deleteproduct/**: Deletes a product by its ID.

### API Testing
The API endpoint unit testing uses **Jasmine** library for the testing.
To start the tests:
```npm
npm test
```
