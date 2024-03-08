import User from "../models/User.model.js";
import {generateJWTToken, generateRefreshToken, hashPassword, isPasswordMatch} from "../utils/auth.utils.js";

/**
 * Authenticates a user based on the identifier (username or email) and password.
 *
 * @param {string} identifier - The username or email provided by the user.
 * @param {string} password - The user's password.
 * @param {boolean} isRememberMe - Whether the user wants to stay logged in.
 * @returns {Promise<Object>} The result of the authentication attempt.
 */
export const login = async (identifier, password, isRememberMe) => {
    try {
        const isEmail = identifier.includes('@');
        let user;

        if (isEmail) {
            user = await User.findOne({ email: identifier }).exec();
        } else {
            user = await User.findOne({ username: identifier }).exec();
        }

        if (!user) {
            return { errorCode: 'USER_NOT_FOUND', success: false };
        }

        const isValid = await isPasswordMatch(password, user.password);

        if (!isValid) {
            return { errorCode: 'INVALID_PASSWORD', success: false };
        }

        const accessToken = isRememberMe ? generateRefreshToken({ id: user._id, email: user.email, role: user.role }) : generateJWTToken({ id: user._id, email: user.email, role: user.role });

        return { accessToken, user: user.toJSON(), success: true };
    } catch (err) {
        return { errorCode: 'UNEXPECTED_ERROR', success: false, message: err.message };
    }
};

/**
 * Registers a new user with the given details.
 *
 * @param {Object} userDetails The details of the user to register.
 * @returns {Promise<Object>} The result of the registration attempt.
 */
export const register = async (userDetails) => {
    const { firstName, lastName, username, email, password, confirmPassword } = userDetails;

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] }).exec();
        if (existingUser) {
            return { message: 'User already exists with the given email or username.', success: false };
        }

        if (password !== confirmPassword) {
            return {message: 'Passwords do not match.', success: false};
        }
        
        const hashedPassword = await hashPassword(password);

        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            password:hashedPassword,
        });

        await newUser.save();

        return { message: 'User registered successfully.', success: true, user: newUser.toJSON() };
    } catch (error) {
        return { message: `Registration failed: ${error.message}`, success: false };
    }
};
