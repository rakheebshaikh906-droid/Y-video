import { fs } from fs;
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: Process.env.CLOUDINARY_CLOUD_NAME, // Click 'View API Key' above to copy your Cloud name
    api_key: Process.env.CLOUDINARY_API_KEY,
    api_secret: Process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadToCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto", // this will automatically detect the file type (image, video, etc.)
            // folder: "youtube-clone" // optional: specify a folder in your Cloudinary account to store the uploaded files
        })
        fs.unlinkSync(filePath); // delete the file from the local server after uploading to Cloudinary
        return result
    } catch (error) {
        fs.unlinkSync(filePath); // delete the file from the local server if there's an error during upload
        return null;
    }
}

export default uploadToCloudinary;