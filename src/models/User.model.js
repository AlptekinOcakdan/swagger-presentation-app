import {Schema, model} from "mongoose";
import {USER_ROLES} from "../constants/types.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - username
 *         - email
 *         - password
 *         - role
 *       properties:
 *         firstName:
 *           type: string
 *           description: The first name of the user
 *         lastName:
 *           type: string
 *           description: The last name of the user
 *         username:
 *           type: string
 *           description: The username of the user
 *         email:
 *           type: string
 *           description: The email address of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         contact:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               countryCode:
 *                 type: string
 *               number:
 *                 type: string
 *         addresses:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               alias:
 *                 type: string
 *               details:
 *                 type: string
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               postalCode:
 *                 type: string
 *         role:
 *           type: string
 *           description: The role of the user
 */
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    contact: [
        {
            countryCode: {
                type: String,
                required: false,
            },
            number: {
                type: String,
                required: false,
            },
        },
    ],
    addresses: [
        {
            alias: String,
            details: String,
            country: String,
            city: String,
            postalCode: String,
        },
    ],
    role: {
        type: String,
        enum: [USER_ROLES],
        default: USER_ROLES.USER,
        required: true,
    },
}, {
    timestamps: true,
});

userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
}

const User = model('User', userSchema);

export default User;