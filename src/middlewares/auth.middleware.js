import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/users.models.js";

export const verifyJwt = asyncHandler(async (req, res, next) => {

    try {
        //token leke aao 
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        //console.log(token);
        if (!token) {
            throw new ApiError(401, "unauthorized request");
        }

        //token verify karo
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        //token se user id nikalo
        const user = await User.findById(decodedToken.id).select("-password -refreshToken");
        //database me user check karo
        if (!user) {
            throw new ApiError(401, "unauthorized request");
        }
        //user ko req me daalo
        req.user = user;
        //current middle ware ka kam hogaya ab request ko next step pe bhejna hai jaise next middleWare/Route
        next();

    } catch (error) {
        //error ko handle karo
        return next(new ApiError(401, error?.message || "unauthorized"));
    }
})

