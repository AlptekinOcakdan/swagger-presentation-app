import {Schema,model} from "mongoose";

const tokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['access', 'refresh'],
        required: true,
    },
    expires: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true,
});