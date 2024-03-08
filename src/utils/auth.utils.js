import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, RESET_TOKEN_SECRET } from "../constants/environment.js";
import bcrypt from "bcrypt";

export const generateJWTToken = (payload) => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {expiresIn: '2h'});
};

export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
};

export const generatePasswordResetToken = (payload) => {
    const token = jwt.sign(payload, RESET_TOKEN_SECRET, { expiresIn: '1h' });
    return token;
};

export const verifyPasswordResetToken = (token) => {
    try {
        const decoded = jwt.verify(token, RESET_TOKEN_SECRET);
        return decoded;
    } catch (error) {
        return error;
    }
};

export const hashPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

export const isPasswordMatch = async (password, hashedPassword) => {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
};

export const verifyJWTToken = (token) => {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (error) {
        return error;
    }
};

export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET);
    } catch (error) {
        return error;
    }
};
