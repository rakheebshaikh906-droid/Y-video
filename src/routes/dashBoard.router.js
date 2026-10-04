import { Router } from "express";
import { getChannelState, getChannelVideos } from "../controllers/dashboard.controller.js";

import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJwt);

router.route("/channel/:channelId").get(getChannelState);
router.route("/channel/:channelId/videos").get(getChannelVideos);

export { router };