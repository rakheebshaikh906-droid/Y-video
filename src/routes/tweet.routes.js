import { Router } from "express";

import {
    createTweet,
    deleteTweets,
    getUserTweets,
    updateTweet,
} from "../controllers/tweet.Controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createTweet);
router.route("/user").get(getUserTweets);

router.route("/:tweetId")
    .patch(updateTweet)
    .delete(deleteTweets);

export default router;