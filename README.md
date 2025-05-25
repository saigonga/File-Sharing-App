# File Sharing App

A secure, real-time file sharing application built with React (frontend), Firebase Authentication, and a Node.js backend using Socket.IO for real-time file transfer.

## Features
- **User Authentication:** Register, login, Google sign-in, and password reset via Firebase Auth.
- **Room-based File Sharing:** Join/leave rooms to send and receive files in real time.
- **Real-time File Transfer:** Upload and transfer files instantly with progress and status updates.
- **Responsive UI:** Modern, mobile-friendly interface with clear feedback and navigation.
- **Room Management:** Track previous rooms for quick rejoin.
- **Security:** Auth-protected routes and backend CORS configuration.

## Tech Stack
- **Frontend:** React, Firebase Auth, Socket.IO Client
- **Backend:** Node.js, Express, Socket.IO

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Setup

#### 1. Clone the repository
```sh
git clone <your-repo-url>
cd File Sharing App
```

#### 2. Install dependencies
- For the backend:
  ```sh
  cd backend
  npm install
  ```
- For the frontend:
  ```sh
  cd ../frontend
  npm install
  ```

#### 3. Configure Environment Variables
- In the `backend/` folder, create a `.env` file:
  ```env
  PORT=5001
  ```
- (Optional) For Firebase, update the config in `frontend/src/Firebase/firebase.js` as needed.

#### 4. Run the app
- Start the backend server:
  ```sh
  cd backend
  npm start
  ```
- Start the frontend dev server:
  ```sh
  cd ../frontend
  npm run dev
  ```
- Open your browser at [http://localhost:5173](http://localhost:5173)

## Folder Structure
```
File Sharing App/
  backend/         # Node.js + Socket.IO backend
  frontend/        # React + Firebase frontend
```

## Customization
- Update Firebase config in `frontend/src/Firebase/firebase.js`.
- Adjust CORS or security settings in `backend/index.js` as needed.

## License
This project is for educational/demo purposes. Please review before using in production.
