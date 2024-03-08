import {Schema,model} from "mongoose";


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