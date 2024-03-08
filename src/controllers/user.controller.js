// user.controller.js
import User from "../models/User.model.js";
import bcrypt from 'bcrypt';
import {hashPassword} from "../utils/auth.utils.js";

/**
 * Retrieves a list of users based on the search query, page, and limit.
 * @param {string} search - The search query.
 * @param {number} page - The page number.
 * @param {number} limit - The number of items per page.
 * @returns {Promise<Object>}
 * */
const getAllUsers = async (search,page, limit) => {
    try {
        const searchRegex = new RegExp(search, 'i');

        const searchQuery = {
            $or: [
                { firstName: { $regex: searchRegex } },
                { lastName: { $regex: searchRegex } },
            ],
        };
        
        const users = await User.find(searchQuery)
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        const count = await User.countDocuments(searchQuery);

        return {
            success: true,
            data: users,
            meta: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit),
            },
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};

/**
 * Retrieves a user based on the user ID.
 * @param {string} userId - The ID of the user to retrieve.
 * @returns {Promise<Object>}
 * */
const getUser = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return {
                success: false,
                message: 'User not found',
            };
        }

        return {
            success: true,
            data: user,
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};

/**
 * Create a new user
 * @param {Object} userData - The user data to create.
 * @returns {Promise<Object>}
 * */
const createUser = async (userData) => {
    try {
        const hashedPassword = await hashPassword(userData.password);
        const user = new User({
            ...userData,
            password: hashedPassword,
        });

        await user.save();

        return {
            success: true,
            message: 'User created successfully',
            data: user.toJSON(),
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};

/**
 * Update an existing user
 * @param {string} userId - user ID
 * @param {Object} updateData - user data to update
 * @returns {Promise<Object>}
 * */
const updateUser = async (userId, updateData) => {
    try {
        if (updateData.password) {
            updateData.password = await hashPassword(updateData.password);
        }

        const user = await User.findByIdAndUpdate(userId, updateData, { new: true });

        if (!user) {
            return {
                success: false,
                message: 'User not found',
            };
        }

        return {
            success: true,
            message: 'User updated successfully',
            data: user.toJSON(),
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};

/**
 * Delete a user by ID
 * @param {string} userId
 * @returns {Promise<{success: boolean, message}|{success: boolean, message: string}>}
 * */
const deleteUser = async (userId) => {
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return {
                success: false,
                message: 'User not found',
            };
        }

        return {
            success: true,
            message: 'User deleted successfully',
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};

export { getAllUsers, getUser, createUser, updateUser, deleteUser };
