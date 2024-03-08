import {removeFileFromUploads} from "../middlewares/storage.middleware.js";
import {uploadImageToS3} from "../services/storage.service.js";

export const upload = async (req, res) => {
    const { file } = req;
    try {
        const uploadedUrl  = await uploadImageToS3(file.path, file.filename);

        if (uploadedUrl.error) {
            return res.status(400).json({ error: uploadedUrl.error });
        }
        removeFileFromUploads(file);

        return res.status(200).json({ url: uploadedUrl, message: 'Upload successful' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};