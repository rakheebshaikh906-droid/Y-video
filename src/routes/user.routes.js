import { Router } from 'express';
import { getAllUsers } from '../controllers/users.controller.js';

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar", maxCount: 1
        },
        {
            name: "coverImage", maxCount: 1
        }]), registerUser);
export default router;