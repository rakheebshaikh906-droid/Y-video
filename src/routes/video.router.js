import { Router } from "express";
import { getAllVideos, publishAVideo, getVideoById, updateVideo, deleteVideo, togglePublishStatus }
    from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getAllVideos);
router.route("/").post(publishAVideo);
router.route("/:videoId").get(getVideoById);
router.route("/:videoId").patch(updateVideo);
router.route("/:videoId").delete(deleteVideo);
router.route("/publish/:videoId").patch(togglePublishStatus);

export default router;