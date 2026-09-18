import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import uploadToCloudinary from '../utils/cloudinary.js';
import { User } from '../models/users.models.js';
import { ApiResponce } from '../utils/ApiResponse.js';

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

    //1)first stpe to get the user details from the request body
    const { username, fullName, email, password } = req.body

    //2)second step to validate the user details, check if any of the fields are empty or not
    if ([username, fullName, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }
    //3)third step to check if user already exists in the database by username or email
    const userExists = await User.findOne({
        $or: [{ username }, { email }]
    });
    if (userExists) {
        throw new ApiError(400, "User already exists");
    }
    //4) multer se image upload karna hai juh locally store ho rahi hai, usko cloudinary pe upload karna hai
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }
    //5)fifth step to upload the avatar and cover image to cloudinary
    const avatar = await uploadToCloudinary(avatarLocalPath);
    const coverImage = await uploadToCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(500, "Failed to upload avatar to cloudinary");
    }

    //5)sixth step to create a new user object and save it to the database
    const user = await User.create({
        username,
        fullName,
        email,
        password,
        avatar: avatar.secure_url,
        coverImage: coverImage?.secure_url || "",
    });
    //7)password and refresh token ko user object se remove karna hai
    const createUser = await User.findById(user._id).select("-password -refreshToken");
    //check if user creation was successful
    if (!createUser) {
        throw new ApiError(500, "Failed to create user");
    }

    //8)final step to return the response to the client
    return res.status(201).json(
        new ApiResponce(201, createUser, "User created successfully")
    );



});
export { registerUser };