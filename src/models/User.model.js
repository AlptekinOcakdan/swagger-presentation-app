import {Schema, model} from "mongoose";
import {USER_ROLES} from "../constants/types.js";

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