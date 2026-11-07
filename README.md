# Muti-Factor-Authentication-Application
Creating a multi-factor authentication application to learn more about MERN in detail implementing each component of the application by scratch
# Multi-Factor Authentication (MFA) Web Application

A full-stack, production-ready Multi-Factor Authentication (MFA) web application built using the MERN stack (MongoDB, Express, React, Node.js). This project demonstrates secure user registration, password hashing, time-based one-time password (TOTP) generation, dynamic QR code creation for authenticator apps, and secure two-factor login verification.

---

## 🚀 Features

* **User Registration & Password Hashing**: Secure user onboarding with password encryption using `bcryptjs`.
* **Two-Factor Authentication (2FA/MFA)**: TOTP key generation and QR code integration compatible with apps like Google Authenticator or Authy using `speakeasy` and `qrcode`.
* **Cloud Database Integration**: Hosted on MongoDB Atlas for reliable, scalable data persistence.
* **Modern Frontend**: React SPA built with Vite for fast UI rendering and clean user workflows.
* **RESTful API**: Clean Express backend routing with error handling and modular controllers.

---

## 🛠️ Tech Stack

### Frontend
* **React** (Vite)
* **Axios** (API communication)
* **CSS3** (Responsive design & custom styling)

### Backend
* **Node.js** & **Express.js** (Server runtime & framework)
* **MongoDB Atlas** & **Mongoose** (Database & ODM)
* **Speakeasy** (MFA / TOTP generation & verification)
* **QRCode** (QR code generation)
* **Bcryptjs** (Password hashing)
* **Dotenv** (Environment variable management)

---

## 📂 Project Structure

```text
Muti-Factor-Authentication-Application/
├── backend/
│   ├── models/
│   │   └── User.js          # Mongoose schema for User & MFA secret
│   ├── .env                 # Backend environment configuration
│   ├── package.json         # Backend dependencies
│   └── server.js            # Express server entry point & API endpoints
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React component managing MFA state
│   │   └── main.jsx         # React application entry point
│   ├── package.json         # Frontend dependencies
│   └── vite.config.js       # Vite configuration
└── README.md                # Project documentation
```

---

## ⚙️ Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v16+ installed)
* A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account and cluster setup.
* An Authenticator App (e.g., Google Authenticator, Microsoft Authenticator, or Authy) on your mobile device.

---

### 1. Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` root folder:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/mfa-project?retryWrites=true&w=majority
   ```
   > **Note:** Replace `<username>`, `<password>`, and `cluster0.xxxxx` with your actual MongoDB Atlas cluster credentials.

4. Start the Node.js backend server:
   ```bash
   node server.js
   ```
   *Expected Output:*
   ```text
   Server running on port 5000
   Connected to MongoDB successfully
   ```

---

### 2. Frontend Setup

1. Open a new terminal window and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:5173
   ```

---

## 🧪 How to Test the Application Flow

1. **User Registration**:
   * Open the frontend app in your browser.
   * Enter a test email and password, then click **Register & Setup MFA**.

2. **MFA Setup**:
   * Scan the displayed QR code using your smartphone's Authenticator app.
   * Enter the generated 6-digit TOTP code to verify and activate MFA.

3. **User Authentication**:
   * Test logging in with your credentials and verifying the live 6-digit code from your authenticator app.

---

## 🔒 Security Best Practices Implemented

* Passwords are strictly hashed before storing in the database.
* Sensitive environment variables (database URIs, port numbers) are managed securely via `.env`.
* CORS enabled to allow secure interaction between frontend and backend.






//handle frontend

 



//backend
