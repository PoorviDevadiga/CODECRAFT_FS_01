# Authentication System

A simple authentication system with **Node.js backend** and **HTML/CSS/JS frontend**. 
Users can **sign up, log in, and view their profile** after authentication. 
Passwords are securely stored with **bcrypt** and login sessions are handled using **JWT (JSON Web Token)**.

## 🚀 Features
- User **Signup** and **Login**
- **JWT-based Authentication**
- Basic **Profile Page**
- Frontend with HTML, CSS, JavaScript
- Backend with Node.js + Express + MongoDB

## 📂 Project Structure 
auth-system/ ├── backend/ # Node.js + Express API │ ├── server.js │ ├── routes/auth.js │ ├── models/User.js │ ├── middleware/authMiddleware.js │ └── package.json └── frontend/ # HTML, CSS, JS Frontend ├── index.html ├── profile.html ├── style.css └── script.js

## 🛠️ Setup Instructions
### Backend
1. Go inside backend folder 
   ```bash
   cd backend
   npm install
   node server.js
### MongoDB 
1. Database Name: `authDB`
2. Collection Name: `users`
