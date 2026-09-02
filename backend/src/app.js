import express from "express";
import { createServer } from "node:http";

import { Server } from "socket.io";

import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";

import cors from "cors";
import userRoutes from "./routes/users.routes.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);


const ALLOWED_ORIGINS = [
    "https://video-conferencing-frontend-fzy6.onrender.com"
];

app.use(cors({
    origin: (origin, callback) => {
        // allow requests with no origin (like mobile apps or curl requests) or allowed origins
        if (!origin || ALLOWED_ORIGINS.includes(origin) || origin === "*") {
            return callback(null, true);
        }
        return callback(null, true); // fallback allow all origins for smooth access
    },
    credentials: true
}));
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

const start = async () => {
    try {
        const connectionDb = await mongoose.connect(process.env.MONGO_URI);

        console.log(
            `MONGO Connected DB Host: ${connectionDb.connection.host}`
        );

        const PORT = process.env.PORT || 8001;

        server.listen(PORT, () => {
            console.log(`SERVER IS LISTENING ON PORT ${PORT}`);
        });

    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};








start();
