import { asyncHandler } from '../utils/asyncHandler.js';

const getAllUsers = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'users fetched successfully'
    });
});