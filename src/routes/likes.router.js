import { Router } from "express";
import { toggleVideoLike, toggleTweetLikes, toggleCommentLike, getLikesVideo } from "../controllers/likes.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/video/:videoId").post(toggleVideoLike);
router.route("/video/:videoId").get(getLikesVideo);
router.route("/tweet/:tweetId").post(toggleTweetLikes);
router.route("/comment/:commentId").post(toggleCommentLike);

export default router