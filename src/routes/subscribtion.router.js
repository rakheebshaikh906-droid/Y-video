import { Router } from "express";
import { toggleSubscription, getUserSubscriptions, getSubscribedChannels } from "../controllers/subscribtion.controller.js"

import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJwt);

router.route("/").post(toggleSubscription);
router.route("/user/:userId").get(getUserSubscriptions);
router.route("/channel/:channelId").get(getSubscribedChannels);

export { router };