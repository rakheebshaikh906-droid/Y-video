import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJwt);

router.route("/").get(getAllVideos);
router.route("/").post(publishAVideo);
router.route("/:videoId").get(getVideoById);
router.route("/:videoId").patch(updateVideo);
router.route("/:videoId").delete(deleteVideo);
router.route("/publish/:videoId").patch(togglePublishStatus);

export default router;