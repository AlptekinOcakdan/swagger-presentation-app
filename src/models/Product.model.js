import {Schema,model} from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - title
 *         - slug
 *         - status
 *         - stock
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the product
 *         title:
 *           type: string
 *           description: The title of the product
 *         description:
 *           type: string
 *           description: The description of the product
 *         slug:
 *           type: string
 *           description: The slug of the product
 *         status:
 *           type: string
 *           description: The status of the product
 *         stock:
 *           type: integer
 *           description: The stock level of the product
 *         price:
 *           type: number
 *           description: The price of the product
 *         image:
 *           type: string
 *           description: The image URL of the product
 *         categories:
 *           type: array
 *           items:
 *             type: string
 *           description: The categories this product belongs to
 *         createdBy:
 *           type: string
 *           description: The user who created the product
 */
const productSchema = new Schema({
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
    stock: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    categories: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Category',
        },
    ],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
}, {
    timestamps: true,
});

const Product = model('Product', productSchema);

export default Product;