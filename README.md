# FreshCart Grocery Delivery Web Application

FreshCart is a full-stack grocery delivery application built with React, Java Spring Boot, and MySQL. Customers can browse products, manage a shopping cart, place orders, track delivery progress, cancel eligible orders, and save delivery addresses. Admin users can manage products and update customer order statuses.

## Technology Stack

### Frontend
- React.js
- Vite
- HTML5
- CSS3
- JavaScript
- React Router DOM
- Axios
- React Hot Toast
- Lucide React Icons

### Backend
- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- JWT Authentication
- BCrypt Password Hashing
- Bean Validation

### Database and Deployment
- MySQL
- Vercel for frontend
- Render for backend
- Docker for backend deployment

## Features

### Customer
- Register and login
- Browse grocery products
- Search and filter products
- View product details
- Add products to cart
- Stock-aware cart quantities
- Checkout with Cash on Delivery
- Save delivery address
- View and update profile
- View order history
- Track order status
- Cancel placed orders

### Admin
- Admin login
- Dashboard
- Add products
- Edit products
- Delete products
- View customer orders
- Update order status

## Security

- Passwords are hashed using BCrypt
- JWT token authentication
- Admin-only backend product management
- Customer-specific order access
- Backend stock validation before placing orders

## Local Setup

### Backend

**Quick local dev (no MySQL):** install [JDK 17+](https://adoptium.net/) and [Maven](https://maven.apache.org/download.cgi), then from `grocery-backend`:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

On Windows you can also run `start-dev.cmd` after JDK is installed.

**With MySQL:** create database `grocery_db`, set credentials in `application.properties`, then:

```bash
mvn spring-boot:run
```

The API runs at `http://localhost:8080`. The frontend calls `http://localhost:8080/api/products`.

### Frontend
Install dependencies:

```bash
npm install
```

Start the application:

```bash
npm run dev
```

## Demo Accounts

### Admin
- Email: admin@gmail.com
- Password: admin123

### Customer
- Email: user@gmail.com
- Password: 123456

## API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login

### Products
- GET /api/products
- GET /api/products/{id}
- POST /api/products
- PUT /api/products/{id}
- DELETE /api/products/{id}

### Orders
- POST /api/orders
- GET /api/orders/my
- PUT /api/orders/{id}/cancel
- GET /api/admin/orders
- PUT /api/admin/orders/{id}/status

### Profile
- GET /api/profile
- PUT /api/profile

## Future Enhancements
- Stripe online payments
- Product image upload using Cloudinary
- Email order confirmation
- Product reviews and ratings
