import { Router } from "express";
import { createPlaylist, getUserPlaylists, getPlaylistById, addVideoToPlaylist, removeVideoFromPlaylist, deletePlaylist, updatePlaylist } from "../controllers/playlist.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJwt);

router.route("/").post(createPlaylist);
router.route("/user").get(getUserPlaylists);
router.route("/:playlistId").get(getPlaylistById);
router.route("/:playlistId").patch(updatePlaylist);
router.route("/:playlistId").delete(deletePlaylist);

router.route("/:playlistId/videos/:videoId")
    .post(addVideoToPlaylist)
    .delete(removeVideoFromPlaylist);



export { router };