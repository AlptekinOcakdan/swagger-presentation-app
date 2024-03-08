import {Schema, model} from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - title
 *         - slug
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the category
 *         title:
 *           type: string
 *           description: The title of the category
 *         description:
 *           type: string
 *           description: The description of the category
 *         slug:
 *           type: string
 *           description: The slug of the category
 *         status:
 *           type: string
 *           description: The status of the category
 *         parent:
 *           type: string
 *           description: The ID of the parent category
 *         coverImage:
 *           type: string
 *           description: The cover image of the category
 *         createdBy:
 *           type: string
 *           description: The ID of the user who created the category
 *         products:
 *           type: array
 *           items:
 *             type: string
 *           description: The list of product IDs in the category
 *       example:
 *         id: "123456789"
 *         title: "Electronics"
 *         description: "All electronic gadgets"
 *         slug: "electronics"
 *         status: "Active"
 *         parent: "123456"
 *         coverImage: "url-to-image"
 *         createdBy: "user123"
 *         products: ["prod123", "prod456"]
 */
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