import multer from 'multer';
import fs from 'fs';

// Multer configuration

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const fileName = file.originalname.toLowerCase().split(' ').join('-');
            cb(null, `${Date.now()}-${fileName}`);
        },
    }),
    limits: {fileSize: 1024 * 1024 * 5}, // 5MB file size limit for uploads
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a valid image file'), false);
        }
        cb(null, true);
    },
});

const pdfStorage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'src/uploads/pdf'); // make sure this directory exists
    },
    filename(req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

export const pdfUpload = multer({
    storage: pdfStorage,
    fileFilter(req, file, cb) {
        if (file.mimetype !== 'application/pdf') {
            cb(new Error('Only PDF files are allowed!'), false);
        } else {
            cb(null, true);
        }
    }
}).single('pdfFile');

//csv upload
const csvStorage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'src/uploads/csv/'); // Make sure this directory exists
    },
    filename(req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

export const csvUpload = multer({
    storage: csvStorage,
    fileFilter(req, file, cb) {
        if (file.mimetype !== 'text/csv') {
            cb(new Error('Only CSV files are allowed!'), false);
        } else {
            cb(null, true);
        }
    }
}).single('csvFile');

// remove image from uploads folder after upload to cloudinary is successful

export const removeFileFromUploads = async (file) => {
    fs.unlink(file.path, (err) => {
        if (err) {
            console.error(err);
            return false;
        }
        console.log(`${file.path} removed from uploads folder`);
    });
    return true;
}

export default upload;