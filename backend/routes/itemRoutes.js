import express from 'express';
const router = express.Router();
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  deleteItemAsAdmin, // <-- Import the new controller
} from '../controllers/itemController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

router
  .route('/')
  .get(getItems)
  .post(protect, upload.single('image'), createItem); // 'image' must match form field name

// Admin-specific route for deleting any item
router.route('/admin/:id').delete(protect, admin, deleteItemAsAdmin); // <-- This is the new line

router
  .route('/:id')
  .get(getItemById)
  .put(protect, updateItem)
  .delete(protect, deleteItem); // This is for users deleting their OWN posts

export default router;