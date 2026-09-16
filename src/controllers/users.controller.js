import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const registerUser = asyncHandler(async (req, res) => {
    //get user detatails from fronEnd
    //validate user details--not empty
    //check if user already exists --- username ,email
    //check for image,check for avatar
    //upload them to cloudinary
    //create user object create entry in database
    //remove password and refresh token from user object
    //check the user creation
    //return res

    const { username, fullName, email, password } = req.body

    if ([username, fullName, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }
});
export { registerUser };