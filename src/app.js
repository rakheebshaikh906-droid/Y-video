import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { router as userRouter } from "./routes/user.routes.js";
import { router as playlistRouter } from "./routes/playlist.router.js";
import { router as dashboardRouter } from "./routes/dashBoard.router.js";
import { router as tweetRouter } from "./routes/tweet.routes.js";
import { router as subscriptionRouter } from "./routes/subscribtion.router.js";
import { router as videoRouter } from "./routes/video.router.js";
import { router as likeRouter } from "./routes/likes.router.js";
import { router as commentRouter } from "./routes/comment.router.js";
import { router as healthCheckRouter } from "./routes/healthCheck.router.js";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/healthcheck", healthCheckRouter);

export { app };