import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import {
    registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword
    , getCurrentuser, updateAccountDetails, updateAvatarimage, getUserChannelProfile, getWatchHistory
} from '../controllers/users.controller.js';

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar", maxCount: 1
        },
        {
            name: "coverImage", maxCount: 1
        }]), registerUser);

//login user route
router.route("/login").post(loginUser);

//logout user Route         //middleware
//secure route
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJwt, changeCurrentPassword);
router.route("/current-user").get(verifyJwt, getCurrentuser);


export { router };