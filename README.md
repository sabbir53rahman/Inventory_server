
# Inventory_server
Inventory Management API
This project provides a backend for managing products, orders, and users in an inventory system. It includes APIs to manage users (admin and regular), products, and orders. The backend is built using Express.js and MongoDB.

Table of Contents
Features
Tech Stack
Installation
Environment Variables
API Endpoints
Run Locally
License
Features
User management (registration, deletion, admin role assignment)
Product management (add, search, get products)
Order management (place orders, get orders)
Authentication & Authorization (admin check)
Tech Stack
Node.js: JavaScript runtime for server-side logic.      
Express.js: Web framework for handling HTTP requests.
MongoDB: NoSQL database to store users, products, and orders.
MongoDB Atlas: Cloud-hosted MongoDB service for database management.
JWT (JSON Web Tokens): For user authentication.
CORS: To handle cross-origin requests.
Installation
Clone the repository

bash
git clone https://github.com/sabbir53rahman/Inventory_server.git
Install dependencies Navigate to the project directory and install the dependencies:

bash

cd inventory-backend
npm install
Set up environment variables Create a .env file in the root directory and add the following variables:

env

DB_USER=your_mongo_db_username
DB_PASS=your_mongo_db_password
PORT=5000  # Optional, defaults to 5000
Environment Variables
DB_USER: Your MongoDB username.
DB_PASS: Your MongoDB password.
PORT: The port where your server will run (default is 5000).
API Endpoints
Users
POST /users: Create a new user

Request body: { "name": "User", "email": "user@example.com", "password": "password" }
Response: { "message": "User created successfully", "data": { ...user } }
GET /users: Get all users

Response: [ { ...user1 }, { ...user2 } ]
PATCH /users/admin/:id: Make a user an admin

Request params: :id (user ID)
Response: { "message": "User role updated to admin" }
DELETE /users/:id: Delete a user

Request params: :id (user ID)
Response: { "message": "User deleted successfully" }
GET /isAdmin/:email: Check if a user is an admin

Request params: :email (user email)
Response: { "isAdmin": true/false }
POST /currentUser: Get the current user by email

Request body: { "email": "user@example.com" }
Response: { "message": "User found successfully", "data": { ...user } }
Products
POST /products: Add a new product

Request body: { "name": "Product", "price": 100 }
Response: { "message": "Product added successfully", "data": { ...product } }
GET /products: Get all products with optional pagination and search

Query parameters:
page: Page number (optional)
size: Number of items per page (optional)
search: Search term for filtering products by name (optional)
Response: { "products": [ ...products ], "meta": { "currentPage": 1, "totalPages": 5 } }
Orders
POST /orders: Place a new order

Request body: { "productId": "123456789", "quantity": 2, "customerName": "John Doe", "customerEmail": "john@example.com" }
Response: { "message": "Order added successfully", "data": { ...order } }
GET /orders: Get all orders with optional search

Query parameters:
search: Search term for filtering orders by customer name or email
Response: { "message": "Orders retrieved successfully", "data": [ ...orders ], "totalOrderPrice": 500 }
Run Locally
Start the server:

bash

npm start
The server will start on http://localhost:5000 by default.

Access API: Use tools like Postman or curl to test the API endpoints.

License
This project is licensed under the MIT License - see the LICENSE file for details.
