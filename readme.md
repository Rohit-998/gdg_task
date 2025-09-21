# 📚 Library Management System Backend

This is a **RESTful API** built using **Node.js + Express + MongoDB + Redis** for a **Library Management System**.  
It includes **CRUD operations** for books, authentication, role-based access (Admin/User), analytics, caching, and rate-limiting.  
Additionally, Docker & Nginx are used for containerization and load balancing.  

---

## 🚀 Features

- User Authentication (JWT + Cookies)  
- Role-based Access (Admin / User)  
- CRUD Operations for Books (Create, Read, Update, Delete)  
- Borrow & Return Book functionality  
- Filters & Pagination for book listing (**implemented in `getAllBooks` controller**)  
- Caching with Redis for performance optimization  
- Rate limiting to secure APIs  
- Admin auto-setup (first run creates default Admin from `.env`)  
- Analytics API for library statistics  

---

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Rohit-998/gdg_task
cd server 
 
 ## .env

PORT=8000
CLIENT_URL=http://localhost:3000


MONGO_URI=mongodb://mongo:27017/library


REDIS_HOST=redis
REDIS_PORT=6379

 REDIS_URL=redis://localhost:6379


JWT_SECRET=your_jwt_secret


ADMIN_EMAIL=rohitagrawal7974@gmail.com
ADMIN_PASSWORD=rohit123


# 🔑 API Documentation
🔐 Auth Routes (/api/auth)

POST /signup → Register new user

POST /login → User login (returns JWT in cookie)

POST /logout → Logout user

📚 Book Routes (/api/books)

GET / → Get all books (supports filters & pagination)

POST /addbook → Add a book (Admin only)

PUT /updatebook/:id → Update book (Admin only)

DELETE /deletebook/:id → Delete book (Admin only)

POST /borrow/:id → Borrow a book (User)

POST /return/:id → Return a book (User/Admin)

GET /analytics → Get book statistics (Admin only)

👤 User Routes (/api/users)

GET /user → Get logged-in user details

GET /dashboard → Get borrowed books for logged-in user (with pagination)

 
🎯 Bonus Features Implemented

Data caching (Redis)

Rate limiting (express-rate-limit)

Dockerized app with Nginx load balancer

Role-based access control (Admin/User)

Pagination & Filtering in getAllBooks controller

Auto Admin setup

# Project Structure
├── config/
│   ├── rateLimiter.js
│   └── redisClient.js
├── controllers/
│   ├── AuthController.js
│   ├── BookController.js
│   └── UserController.js
├── middleware/
│   ├── isAdmin.js
│   └── verifyToken.js
├── models/
│   ├── bookModel.js
│   ├── userModel.js
│   └── setUpAdmin.js
├── routes/
│   ├── AuthRoutes.js
│   ├── BookRouter.js
│   └── UserRoutes.js
├── index.js
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
└── package.json
