
//using promises 
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(error => next(error));
};

export { asyncHandler };


//using try-catch

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next);
//     } catch (error) {
//         err.status(500).json({
//             success: false,
//             message: error.message
//        });
//     }
// };



