import { Router } from "express";
import { addComment, updateComment, deleteComment, getVideoComment } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.use(verifyJWT);

router.route("/video/:videoId").post(addComment);
router.route("/video/:videoId").get(getVideoComment);
router.route("/:commentId").patch(updateComment);
router.route("/:commentId").delete(deleteComment);

export default router