import {Schema, model} from "mongoose";

const categorySchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: false,
        trim: true,
    },
    slug: {
        type: String,
        lowercase: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ['Active', 'Draft', 'Deactive'],
        default: 'Draft',
        required: true,
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product',
        },
    ],
    coverImage: {
        type: String,
        required: false,
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: false,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
}, {
    timestamps: true,
});

const Category = model('Category', categorySchema);

export default Category;