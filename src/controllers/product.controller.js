// product.controller.js
import Product from "../models/Product.model.js";
import slugify from "slugify";

/**
 * Fetch all products
 * @param {string} search - search query
 * @param {number} page - page number
 * @param {number} limit - number of items per page
 * @param {string} sortBy - field to sort by
 * @param {string} sortOrder - sort order
 * @returns {Promise<Object>}
 * */
const getAllProducts = async (search, page, limit, sortBy, sortOrder) => {
    try {
        const searchRegex = new RegExp(search, 'i');
        const matchConditions = {
            title: {$regex: searchRegex},
        };
        const pipeline = [
            {$match: matchConditions},
            {$sort: {[sortBy]: sortOrder === 'asc' ? 1 : -1}},
            {$skip: (page - 1) * limit},
            {$limit: limit},
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categories',
                    foreignField: '_id',
                    as: 'categoryDetails',
                },
            },
            {$unwind: {path: '$categoryDetails', preserveNullAndEmptyArrays: true}},
        ];

        const products = await Product.aggregate(pipeline);

        if (!products || products.length === 0) {
            return {
                success: false,
                message: 'No products found',
            };
        }

        const count = await Product.countDocuments(matchConditions);

        return {
            products,
            meta: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit),
            },
            success: true,
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};

/**
 * Fetch a single product by ID
 * @param {string} productId - product ID
 * @returns {Promise<Object>}
 * */
const getProduct = async (productId) => {
    try {
        const product = await Product.findById(productId).populate('categories').populate('createdBy');
        if (!product) {
            return {
                success: false,
                message: 'Product not found',
            };
        }

        return {
            success: true,
            data: product,
        };
    }catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};

/**
 * Create a new product
 * @param {string} title - product title
 * @param {string} description - product description
 * @param {number} stock - product stock
 * @param {number} price - product price
 * @param {string} image - product image
 * @param {Array} categories - product categories
 * @param {string} creator - product creator
 * @returns {Promise<Object>}
 * */
const createProduct = async (title, description, stock, price, image, categories, creator) => {
    try {
        const slug = slugify(title, { lower: true }) + '-' + Date.now();
        const product = new Product({
            title,
            description,
            slug,
            stock,
            price,
            image,
            categories,
            createdBy: creator,
        });
        await product.save();
        return {
            success: true,
            message: 'Product created successfully',
            data: product,
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};

/**
 * Update an existing product
 * @param {string} productId - product ID
 * @param {Object} updateData - product data to update
 * @returns {Promise<Object>}
 * */
const updateProduct = async (productId, updateData) => {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return {
                success: false,
                message: 'Product not found',
            };
        }

        Object.keys(updateData).forEach((key) => {
            product[key] = updateData[key];
        });

        await product.save();
        return {
            success: true,
            message: 'Product updated successfully',
            data: product,
        };
    }catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};

/**
 * Delete a product by ID
 * @param productId
 * @returns {Promise<{success: boolean, message}|{success: boolean, message: string}>}
 */
const deleteProduct = async (productId) => {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return {
                success: false,
                message: 'Product not found',
            };
        }
        await Product.findByIdAndDelete(productId);
        return {
            success: true,
            message: 'Product deleted successfully',
        };
    }catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};

export {getAllProducts, getProduct, createProduct, updateProduct, deleteProduct};
