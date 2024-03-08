import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {AWS_ACCESS_KEY, AWS_REGION, AWS_SECRET_KEY} from "../constants/environment.js";
import path from "path";
import fs from "fs";
import util from "util";
import mime from "mime-types";

// Configure AWS S3 Client
export const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY
    }
});

const readFile = util.promisify(fs.readFile);


/**
 * Uploads an image file to AWS S3.
 * @param {string} filePath - The path to the image file to upload.
 * @param {string} fileName - The name of the file to be saved on S3.
 * @returns {Promise<Object>} - The URL of the uploaded image.
 */
export const uploadImageToS3 = async (filePath, fileName) => {
    try {
        const fileContent = await readFile(filePath);
        const contentType = mime.lookup(filePath) || 'application/octet-stream';

        const s3Key = `uploads/${fileName}`;
        const bucketName = "swagger-presentation-app";

        const params = {
            Bucket: bucketName,
            Key: s3Key,
            Body: fileContent,
            ContentType: contentType,
        };
        const command = new PutObjectCommand(params);
        await s3Client.send(command);
        return `https://${bucketName}.s3.${AWS_REGION}.amazonaws.com/${s3Key}`;
    } catch (error) {
        throw new Error(`Error uploading image to S3: ${error.message}`);
    }
};


export const uploadQuestionToS3 = async (buffer, fileName, contentType = 'image/jpeg') => {
    try {
        const s3Key = `question/${fileName}`;

        const params = {
            Bucket: "swagger-presentation-app",
            Key: s3Key,
            Body: buffer,
            ContentType: contentType,
        };

        const command = new PutObjectCommand(params);
        const result = await s3Client.send(command);
        return `https://${params.Bucket}.s3.${AWS_REGION}.amazonaws.com/${s3Key}`;
    } catch (error) {
        throw new Error(`Error uploading image to S3: ${error.message}`);
    }
};


export const uploadUserImageToS3 = async (filePath, fileName) => {
    try {
        const fileContent = await readFile(filePath);

        const s3Key = `user/${fileName}`;
        const params = {
            Bucket: "swagger-presentation-app",
            Key: s3Key,
            Body: fileContent,
            ContentType: 'image/jpeg', // Adjust based on actual file type
        };

        const command = new PutObjectCommand(params);
        await s3Client.send(command);
        return `https://${params.Bucket}.s3.${AWS_REGION}.amazonaws.com/${s3Key}`;
    } catch (error) {
        throw new Error(`Error uploading image to S3: ${error.message}`);
    }
};

export const uploadFileToS3 = async (filePath, folder) => {
    const fileContent = fs.readFileSync(filePath);
    const originalFileName = path.basename(filePath);
    const timestamp = Date.now(); // Current time in milliseconds
    const fileName = `${timestamp}-${originalFileName}`;
    const key = `${folder}${fileName}`;

    const params = {
        Bucket: "swagger-presentation-app",
        Key: key,
        Body: fileContent,
        ContentType: 'application/pdf'
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    return `https://${params.Bucket}.s3.${AWS_REGION}.amazonaws.com/${key}`;
};