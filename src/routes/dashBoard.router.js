import { Router } from "express";
import { getChannelState, getChannelVideos } from "../controllers/dashboard.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/channel/:channelId").get(getChannelState);
router.route("/channel/:channelId/videos").get(getChannelVideos);

export default router;