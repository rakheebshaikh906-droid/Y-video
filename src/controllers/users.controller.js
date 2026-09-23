import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import uploadToCloudinary from '../utils/cloudinary.js';
import { User } from '../models/users.models.js';
import { ApiResponce } from '../utils/ApiResponse.js';
//import comparePassword from '../models'
//generate AccestokenAndRefereshToken

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        await user.save({ validateBeforeSave: false }); //refresh token ko save karna hai
        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, 'something went wrong');
    }
}

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
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    let coverImageLocalPath;
    if (req.files && req.files.coverImage && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

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
const loginUser = asyncHandler(async (req, res) => {
    //get user details from request body
    //validate user details
    //check if user exists in the database by username or email
    //compare the password with the hashed password in the database
    //generate access token and refresh token
    //save the refresh token in the database
    //return the access token and refresh token to the client
    //return cookies

    //1) get data
    const { username, email, password } = req.body

    if (!username && !email) {
        throw new ApiError(400, "username or email is not exists");
    }

    //find the user 
    const user = User.findOne({
        $or: [{ username }, { email }]
    });

    //check if user exist or not
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    //check if user enter password are correct or not 
    const isPasswordCorrect = await user.comparePassword(password);

    //check if password is correct or not
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Password is incorrect");
    }

    //give access token and refresh token
    const { accessToken } = await generateAccessTokenAndRefreshToken(user._id);

    //send the response and cookies 
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "none",
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", loggedInUser.refreshToken, options)
        .json(
            new ApiResponce(200,
                {
                    user: loggedInUser, accessToken, refreshToken
                }, "User logged in successfully")
        );

});

const logoutUser = asyncHandler(async (req, res) => {
    //middle ware lekhnge apun juh check karenga jaise verify jwt
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 //refreshToken: undefined , refreshToken: "".
            }

        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "none",
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponce(200, {}, "User logged out successfully")
        );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request");
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?.id);
        if (!user) {
            throw new ApiError(401, "unauthorized request");
        }
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "unauthorized request");

        }
        const option = {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: true
        }
        const { accessToken, newRefreshToken } = await generateAccessTokenAndRefreshToken(user._id);
        return res
            .status(200)
            .cookie("accessToken", accessToken, option)
            .cookie("refreshToken", newRefreshToken, option)
            .json(
                new ApiResponce(200,
                    {
                        user: user, accessToken, refreshToken: newRefreshToken
                    }, "User logged in successfully")
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "unauthorized request");
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const isPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Password is incorrect");
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    return res
        .status(200)
        .json(new ApiResponce(200, {}, 'Password changed successfully'));
})

export { registerUser, loginUser, logoutUser, refreshAccessToken };