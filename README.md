# Online Banking API Documentation

This project aims to develop a web API using Node.js, React, and MongoDB for managing banking operations such as user registration, account management, transactions, and currency conversion. The application is divided into two main sections: administrator and client, each with specific functionalities.

> **Banking API** we will be your new `online bank`, don't forget it!!!.
>
> <p align="center">
>   <img src="https://cdn-icons-png.freepik.com/256/1086/1086743.png?semt=ais_hybrid" width="300" height="300">
> </p>

## Table of Contents
- [Online Banking API Documentation](#online-banking-api-documentation)
  - [Table of Contents](#table-of-contents)
  - [Setup and Installation](#setup-and-installation)
  - [Authentication](#authentication)
  - [Administrator Functions](#administrator-functions)
    - [User Management](#user-management)
    - [Account Management](#account-management)
    - [Transaction Management](#transaction-management)
    - [Product and Service Management](#product-and-service-management)
  - [Client Functions](#client-functions)
    - [Account Management (Client)](#account-management-client)
    - [Transaction Management (Client)](#transaction-management-client)
    - [Favorites Management](#favorites-management)
    - [Currency Conversion](#currency-conversion)
  - [API Endpoints](#api-endpoints)
  - [Error Handling](#error-handling)
  - [Security](#security)
  - [Deployment](#deployment)
  - [Contributing](#contributing)
  - [License](#license)
  - [Thanks](#thanks)

## Setup and Installation

1. Clone the repository

2. Install dependencies:
   ```npm i```

3. Set up environment variables:
Create a `.env` file in the root directory and define the following variables:
`NODE_ENV`, `PORT`, `JWT_SECRET`, `MONGODB_URI`

1. Import sample data to MongoDB:
Import the sample data provided in `configs/data` into your MongoDB database.

1. Run the server:
    ```npm run dev```
## Authentication

The API uses JSON Web Tokens (JWT) for user authentication. Upon successful login, a JWT is generated and included in subsequent requests to authenticate the user.

To authenticate, send a POST request to `/api/auth/login` with the user's credentials. Upon successful authentication, the server responds with a JWT token.

## Administrator Functions

### User Management

- Add, edit, and delete users.
- View user details including account balance and transaction history.
- Restrict modification of certain user fields (e.g., DPI, password).

### Account Management

- Generate random account numbers for new users.
- View account details including balance and transaction history.
- Perform deposits, reversals, and view the last 5 transactions.

### Transaction Management

- View all transactions with sorting options (ascending/descending).
- Transfer funds between accounts with validation (e.g., maximum transfer amount).

### Product and Service Management

- Add, edit, and delete products and services.
- View top-selling products.
- Associate products/services with user accounts.

## Client Functions

### Account Management (Client)

- View account details including balance and transaction history.
- Perform deposits and view the last 5 transactions.

### Transaction Management (Client)

- Transfer funds between accounts with validation.
- View transaction history.

### Favorites Management

- Add, edit, and delete favorite accounts.
- Transfer funds quickly to favorite accounts.

### Currency Conversion

- Integrate a currency conversion API to convert account balances into different currencies.

## API Endpoints

- **POST /api/auth/login**: Authenticate user and generate JWT token.
- **POST /api/auth/register**: Add a new User.
- **GET /api/users**: Get all users.
- **GET /api/users/:id**: Get user details.
- **PUT /api/users/:id**: Update user details.
- **DELETE /api/users/:id**: Delete a user.
- *More endpoints for accounts, transactions, products, and favorites.*

## Error Handling

The API provides descriptive error messages and appropriate HTTP status codes for various scenarios, such as invalid requests, authentication failures, and server errors.

## Security

- Use JWT for user authentication and authorization.
- Implement input validation and sanitize user input to prevent injection attacks.
- Use HTTPS to secure data transmission between client and server.

## Deployment

Deploy the API to a cloud platform such as Heroku, AWS, or Azure for public access.

## Contributing

Contributions are welcome! Fork the repository, make your changes, and submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Thanks

I hope you enjoy the project. Thanks for watching.