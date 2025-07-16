
<p align="center">
  <img src="frontend/public/logo.png" alt="File Sharing App Logo" width="120"/>
</p>

# File Sharing App

A secure, real-time file sharing application with authentication, room-based file transfer, and a modern responsive UI.

[![Deployed on Render](https://img.shields.io/badge/Live%20Demo-Render-blue?logo=render)](https://file-sharing-app-frontend-pjlr.onrender.com)

---

## 🚀 Live Demo

👉 [Try the App on Render](https://file-sharing-app-frontend-pjlr.onrender.com)

---

## ✨ Features
- **User Authentication** (Sign up, Login, Logout) with Firebase
- **Real-time File Transfer** using Socket.IO
- **Room-based Sharing**: Share files securely in private rooms
- **Progress Indicators** for file uploads/downloads
- **Input Validation & Security**: File type/size checks, rate limiting, and more
- **Responsive UI/UX**: Works across devices
- **Environment Variable Support** for easy deployment

---

## 🛠️ Tech Stack
- **Frontend:** React (Vite), Firebase Auth, Socket.IO Client
- **Backend:** Node.js, Express, Socket.IO, dotenv, CORS
- **Deployment:** Render

---

## 📦 Project Structure
```
File Sharing App/
├── backend/           # Node.js + Express + Socket.IO server
├── frontend/          # React (Vite) client
├── .env               # Environment variables (not committed)
├── README.md
└── ...
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/saigonga/File-Sharing-App.git
cd File-Sharing-App
```

### 2. Environment Variables
- Copy `.env.example` to `.env` in both `backend/` and `frontend/` folders and fill in the required values.
- **Frontend:** Set Firebase config and `VITE_BACKEND_URL`.
- **Backend:** Set `PORT`, `FRONTEND_URL`, etc.

### 3. Install dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 4. Run locally
- **Backend:**
  ```bash
  cd backend
  npm start
  ```
- **Frontend:**
  ```bash
  cd frontend
  npm run dev
  ```

---

## 🛡️ Security
- All file transfers are validated and rate-limited.
- Only authenticated users can send/receive files.
- CORS and environment variables are used for secure deployment.

---

## 📄 License
MIT

---

## 🙌 Acknowledgements
- [Firebase](https://firebase.google.com/)
- [Socket.IO](https://socket.io/)
- [Render](https://render.com/)

---

<p align="center">
  <b>Made with ❤️ by Sai Gonga</b>
</p>
