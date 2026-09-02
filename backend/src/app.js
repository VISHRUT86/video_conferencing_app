import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";
import cors from "cors";
import userRoutes from "./routes/users.routes.js";

const app = express();
const server = createServer(app);

console.log("STEP 1: App created");

connectToSocket(server);

console.log("STEP 2: Socket initialized");

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use("/api/v1/users", userRoutes);

console.log("STEP 3: Routes initialized");


const start = async () => {
    try {
        console.log("STEP 4: Checking Mongo URI");
        console.log("MONGO_URI exists:", !!process.env.MONGO_URI);

        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI environment variable is missing");
        }

        console.log("STEP 5: Connecting to MongoDB...");

        const connectionDb = await mongoose.connect(
            process.env.MONGO_URI,
            {
                serverSelectionTimeoutMS: 10000
            }
        );

        console.log(
            "MONGO CONNECTED:",
            connectionDb.connection.host
        );

        const PORT = process.env.PORT || 8001;

        server.listen(PORT, () => {
            console.log(
                `SERVER RUNNING ON PORT ${PORT}`
            );
        });

    } catch (error) {
        console.error("❌ DATABASE ERROR:");
        console.error(error);
        console.error(error.stack);

        process.exit(1);
    }
};


start();
