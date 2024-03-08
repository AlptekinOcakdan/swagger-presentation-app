import Category from "../models/Category.model.js";
import slugify from "slugify";


/**
 * Create a new category
 * @param {string} search - search query
 * @param {number} page - page number
 * @param {number} limit - number of items per page
 * @param {string} sortBy - field to sort by
 * @param {string} sortOrder - sort order
 * @returns {Promise<Object>}
 */
const getAllCategories = async (search, page, limit, sortBy, sortOrder) => {
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
                    localField: 'parent',
                    foreignField: '_id',
                    as: 'parent',
                },
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: 'category',
                    as: 'products',
                },
            },
            {$unwind: {path: '$parent', preserveNullAndEmptyArrays: true}},
            {$unwind: {path: '$products', preserveNullAndEmptyArrays: true}}
        ];

        const categories = await Category.aggregate(pipeline);

        if (!categories || categories.length === 0) {
            return {
                success: false,
                message: 'No categories found',
            };
        }

        const count = await Category.countDocuments(matchConditions);

        return {
            categories,
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
 * @param {string} categoryId
 * @returns {Promise<Object>}
 */
const getCategory = async (categoryId) => {
    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            return {
                success: false,
                message: 'Category not found',
            };
        }
        
        return {
            success: true,
            data: category,
        };
    }catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
}

/**
 * Create a new category
 * @param {string} title - category title
 * @param {string} description - category description
 * @param {string} parent - parent category
 * @param {string} image - category image
 * @param {string} creator - category creator
 * @returns {Promise<Object>}
 * */
const createCategory = async (title,description,parent,image,creator) => {
    try {
        const slug = slugify(title);
        const category = new Category(
            {
                title,
                description,
                slug: `${slug}-${Date.now()}`,
                parent,
                coverImage: image,
                createdBy: creator,
            }
        );
        await category.save();
        return {
            success: true,
            message: 'Category created successfully',
            data: category,
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};

/**
 * Update a category
 * @param {string} categoryId
 * @param {string} title
 * @param {string} description
 * @param {string} parent
 * @param {string} image
 * @returns {Promise<Object>}
 * */
const updateCategory = async (categoryId, title, description, parent, image) => {
    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            return {
                success: false,
                message: 'Category not found',
            };
        }
        
        const updateData = {
            title,
            description,
            parent,
            coverImage: image,
        };
        
        const updatedCategory = await Category.findByIdAndUpdate(categoryId, updateData, {new: true});
        return {
            success: true,
            message: 'Category updated successfully',
            data: updatedCategory,
        };
    }catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
}

/**
 * Delete a category
 * @param {string} categoryId
 * @returns {Promise<Object>}
 * */

const deleteCategory = async (categoryId) => {
    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            return {
                success: false,
                message: 'Category not found',
            };
        }
        await Category.findByIdAndDelete(categoryId);
        return {
            success: true,
            message: 'Category deleted successfully',
        };
    }catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
}

export {getAllCategories, getCategory, createCategory,updateCategory,deleteCategory};

