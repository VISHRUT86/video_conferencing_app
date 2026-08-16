# 🎥 Video Conferencing Application

A full-stack, real-time video conferencing web application inspired by Zoom and Google Meet. Built using **React**, **Node.js**, **Express**, **Socket.io**, **WebRTC**, and **MongoDB**.

🌐 **Live Demo (Frontend)**: [https://video-conferencing-frontend-fzy6.onrender.com](https://video-conferencing-frontend-fzy6.onrender.com) 
⚡ **Live Backend API**: [https://video-conferencing-app-fb11.onrender.com](https://video-conferencing-app-fb11.onrender.com)

---

## 🚀 Features

- 📹 **Real-Time Video & Audio Conferencing**: Multi-user P2P video calls powered by WebRTC and Socket.io signaling.
- 💬 **In-Call Live Chat**: Instant messaging during video calls with room participants.
- 🖥️ **Screen Sharing**: Share your screen effortlessly during meetings.
- 🎤 **Media Controls**: Easily toggle microphone (mute/unmute) and camera (video on/off).
- 🔐 **User Authentication**: Secure User Registration & Login with password encryption (`bcrypt`) and token authorization.
- 📜 **Activity History**: Log and view past joined meetings in your user profile.
- 🔗 **Custom Meeting Rooms**: Create or join meeting rooms using unique codes or URLs.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React.js (v18)
- **UI Library**: Material-UI (MUI v5) & Emotion
- **Routing**: React Router DOM (v6)
- **Real-Time Communication**: `socket.io-client`, WebRTC (`RTCPeerConnection`)
- **HTTP Client**: Axios

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Real-Time Socket Server**: Socket.io (v4)
- **Database**: MongoDB (Mongoose ORM)
- **Security & Utilities**: Bcrypt, CORS, HTTP Status

---

## 📂 Project Structure

```text
Video_Conferencing/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── socketManager.js     # WebRTC signaling & Socket.io logic
│   │   │   └── user.controller.js   # Auth & user activity controllers
│   │   ├── models/
│   │   │   ├── meeting.model.js     # Meeting MongoDB schema
│   │   │   └── user.model.js        # User MongoDB schema
│   │   ├── routes/
│   │   │   └── users.routes.js      # API route definitions
│   │   └── app.js                   # Server entry point
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx      # Authentication & User State Provider
│   │   ├── pages/
│   │   │   ├── authentication.jsx   # Login / Register page
│   │   │   ├── history.jsx          # Past meetings history page
│   │   │   ├── home.jsx             # User dashboard & join room input
│   │   │   ├── landing.jsx          # App landing page
│   │   │   └── VideoMeet.jsx        # Video meeting room & WebRTC logic
│   │   ├── environment.js           # Server API URL configuration
│   │   ├── App.js                   # Router & App component
│   │   └── index.js                 # Entry point
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```

---

## 💻 Local Getting Started Guide

Follow these step-by-step instructions to set up and run the application on your local machine.

### **Prerequisites**
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (installed automatically with Node.js)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster connection)

---

### **1. Clone the Repository**

```bash
git clone https://github.com/VISHRUT86/video_conferencing_app.git
cd video_conferencing_app
```

---

### **2. Backend Setup**

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Configure environment variables or database connection in `src/app.js`:
   By default, the backend runs on **Port 8001** and connects to MongoDB.

4. Start the backend server:
   ```bash
   npm start
   ```
   *You should see output similar to:*
   ```text
   MONGO Connected DB Host: ac-egai972-shard-00-00.cujabk4.mongodb.net
   LISTENIN ON PORT 8001
   ```

---

### **3. Frontend Setup**

1. Open a new terminal tab/window and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Local API Environment in `src/environment.js`:
   Ensure `IS_PROD` is set to `false` so the frontend connects to your local backend on port `8001`:

   ```javascript
   let IS_PROD = false;
   const server = IS_PROD ?
       "https://video-conferencing-app-fb11.onrender.com" :
       "http://localhost:8001";

   export default server;
   ```

4. Start the React development server:
   ```bash
   npm start
   ```

5. Access the application in your browser:
   ```text
   http://localhost:3000
   ```

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/users/register` | Register a new user |
| `POST` | `/api/v1/users/login` | Authenticate user & get token |
| `POST` | `/api/v1/users/add_to_activity` | Save meeting code to user history |
| `GET` | `/api/v1/users/get_all_activity` | Fetch user meeting history |

---

## ⚡ Socket.io Signaling Events

| Event | Description |
| :--- | :--- |
| `join-call` | Join a specific meeting room URL |
| `signal` | Exchange WebRTC SDP offer/answer and ICE candidates |
| `chat-message` | Broadcast real-time text message to room participants |
| `user-left` | Notify participants when a user disconnects |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the repository issues.

---

## 📄 License

This project is open source and available under the [ISC License](LICENSE).
