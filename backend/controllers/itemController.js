import asyncHandler from 'express-async-handler';
import Item from '../models/itemModel.js';
import fs from 'fs';
import path from 'path';

// Helper to remove image file
const removeImageFile = (imagePath) => {
  // Construct the full path to the file
  // imagePath is like '/uploads/filename.jpg'
  // We need the path relative to the project root
  const __dirname = path.resolve();
  const filePath = path.join(__dirname, imagePath);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Failed to delete image: ${filePath}`, err);
    } else {
      console.log(`Successfully deleted image: ${filePath}`);
    }
  });
};


// @desc    Get all items with search, filter, and pagination
// @route   GET /api/items
// @access  Public
const getItems = asyncHandler(async (req, res) => {
  // Use 1000 as a simple "get all" for admin, or use pageSize from query
  const pageSize = Number(req.query.pageSize) || 10;
  const page = Number(req.query.pageNumber) || 1;

  // Build filter object
  const keyword = req.query.keyword
    ? { title: { $regex: req.query.keyword, $options: 'i' } }
    : {};
  
  const category = req.query.category ? { category: req.query.category } : {};
  const location = req.query.location
    ? { location: { $regex: req.query.location, $options: 'i' } }
    : {};

  // Combine filters
  const filters = { ...keyword, ...category, ...location };

  const count = await Item.countDocuments(filters);
  const items = await Item.find(filters)
    .sort({ createdAt: -1 })
    .populate('user', 'name email') // Also fetch user info
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ items, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Create a new item
// @route   POST /api/items
// @access  Private
const createItem = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    date,
    location,
    contactName,
    contactEmail,
  } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error('Image is required');
  }
  // req.file.path comes from multer. Remove 'backend\' if present.
  const imagePath = req.file.path.replace(/\\/g, '/').replace('backend/', '');

  const item = new Item({
    title,
    description,
    category,
    date,
    location,
    contactName,
    contactEmail,
    image: `/${imagePath}`, // Path to be stored in DB
    user: req.user._id,
  });

  const createdItem = await item.save();
  res.status(201).json(createdItem);
});

// @desc    Get item by ID
// @route   GET /api/items/:id
// @access  Public
const getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (item) {
    res.json(item);
  } else {
    res.status(404);
    throw new Error('Item not found');
  }
});

// @desc    Update an item
// @route   PUT /api/items/:id
// @access  Private
const updateItem = asyncHandler(async (req, res) => {
  const { title, description, category, date, location, contactName, contactEmail, status } = req.body;
  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  // Check if user is the owner or an admin
  if (item.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('User not authorized to update this item');
  }

  item.title = title || item.title;
  item.description = description || item.description;
  item.category = category || item.category;
  item.date = date || item.date;
  item.location = location || item.location;
  item.contactName = contactName || item.contactName;
  item.contactEmail = contactEmail || item.contactEmail;
  item.status = status || item.status;

  const updatedItem = await item.save();
  res.json(updatedItem);
});

// @desc    Delete an item (by owner or admin)
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  // Check if user is the owner or an admin
  if (item.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('User not authorized to delete this item');
  }

  // Also delete the image file from the server
  if (item.image) {
    removeImageFile(item.image);
  }

  await item.deleteOne();
  res.json({ message: 'Item removed' });
});


// @desc    Delete an item (Admin only)
// @route   DELETE /api/items/admin/:id
// @access  Private/Admin
const deleteItemAsAdmin = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  // Also delete the image file from the server
  if (item.image) {
    removeImageFile(item.image);
  }

  await item.deleteOne();
  res.json({ message: 'Item removed by admin' });
});


export { 
  getItems, 
  createItem, 
  getItemById, 
  updateItem, 
  deleteItem,
  deleteItemAsAdmin // <-- This is the export that was missing
};