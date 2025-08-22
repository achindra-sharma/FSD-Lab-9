# Full-Stack Online Course Management System - User Module

This project is a full-stack web application demonstrating user management for an EdTech platform. It includes user registration with profile picture uploads, email confirmation, and complete CRUD (Create, Read, Update, Delete) functionality.

## Features

*   **User Registration:** New users can register with their name, email, phone, and a profile picture.
*   **Email Confirmation:** Automatically sends a "Registration Successful" email using Nodemailer and a Gmail account.
*   **Display All Users:** Fetches and displays a list of all registered users from the database.
*   **CRUD Operations:** Full REST API for creating, reading, updating, and deleting users.
*   **File Uploads:** Handles profile picture uploads using Multer, storing them locally on the server.
*   **Responsive Frontend:** A clean and responsive user interface built with React and Tailwind CSS.

## Tech Stack

*   **Frontend:** React.js (with Vite), Tailwind CSS
*   **Backend:** Node.js, Express.js
*   **Database:** MySQL
*   **API:** RESTful API
*   **File Handling:** Multer
*   **Emailing:** Nodemailer

---

## Prerequisites

Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v16 or later)
*   [MySQL Server](https://dev.mysql.com/downloads/mysql/)
*   A code editor like [VS Code](https://code.visualstudio.com/)
*   An API testing tool like [Postman](https://www.postman.com/) or the [Thunder Client](https://www.thunderclient.com/) extension for VS Code.

---

## Setup and Installation

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install
```

**Environment Variables:**
Create a `.env` file inside the `backend` directory and add the following credentials.

```env
# MySQL Database
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=edtech_db

# Nodemailer (Gmail Example)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_character_gmail_app_password
```
> **Note:** Use `nodemon` for development to automatically restart the server on file changes. It was installed as a dev dependency.

### 2. Frontend Setup

```bash
# Navigate to the frontend directory from the root
cd frontend

# Install dependencies
npm install
```

### 3. Database Setup
Connect to your MySQL server and run the following SQL script to create the necessary database and table.

```sql
CREATE DATABASE edtech_db;

USE edtech_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    profile_picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Running the Application

1.  **Start the Backend Server:**
    *   Open a terminal in the `backend` directory.
    *   Run the command: `npm start`
    *   The server will start on `http://localhost:3001`.

2.  **Start the Frontend Development Server:**
    *   Open a **second** terminal in the `frontend` directory.
    *   Run the command: `npm run dev`
    *   The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

---

## API Endpoint Testing

You can use Postman or Thunder Client to test the backend API endpoints.

| Method | Endpoint              | Description                      | Body (Example)                                     |
|--------|-----------------------|----------------------------------|----------------------------------------------------|
| `POST` | `/api/users`          | Register a new user (form-data)  | `{ name, email, phone, profilePicture (file) }`     |
| `GET`  | `/api/users`          | Get a list of all users          | (None)                                             |
| `PUT`  | `/api/users/:id`      | Update a user's details (JSON)   | `{ "name": "New Name", "phone": "1234567890" }` |
| `DELETE`| `/api/users/:id`      | Delete a specific user           | (None)                                             |