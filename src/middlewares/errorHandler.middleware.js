import { NODE_ENV } from '../constants/environment.js';

// Custom error class to handle global errors
export class CustomError extends Error {
    constructor(message, statusCode) {
        console.log(message, statusCode, 'custom error');

        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';

        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}
// check if the error is in developmet then send the error with stack trace
const devErrors = (res, error) => {
    return res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
        stackTrace: error.stack,
        error: error,
    });
};

const castErrorHandler = (err) => {
    const msg = `Invalid value for ${err.path}: ${err.value}!`;
    return new CustomError(msg, 400);
};

const duplicateKeyErrorHandler = (err) => {
    const name = err.keyValue.name;
    const msg = `There is already a with this name ${name}. Please use another name!`;

    return new CustomError(msg, 400);
};

const validationErrorHandler = (err) => {
    const errors = Object.values(err.errors).map((val) => val.message);
    const errorMessages = errors.join('. ');
    const msg = `Invalid input data: ${errorMessages}`;

    return new CustomError(msg, 400);
};

const prodErrors = (res, error) => {
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message,
        });
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong! Please try again later.',
        });
    }
};

export default function (error, req, res, next) {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    if (NODE_ENV === 'development') {
        devErrors(res, error);
    } else if (NODE_ENV === 'production') {
        if (error.name === 'CastError') error = castErrorHandler(error);
        if (error.code === 11000) error = duplicateKeyErrorHandler(error);
        if (error.name === 'ValidationError') error = validationErrorHandler(error);

        prodErrors(res, error);
    }
}
