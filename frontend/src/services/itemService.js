import api from './api';

// For public homepage (with pagination/search)
const getItems = (page = 1, params = {}) => {
  return api.get('/items', {
    params: {
      pageNumber: page,
      ...params,
    },
  });
};

// For admin dashboard (get ALL items, no pagination)
const getItemsForAdmin = () => {
  // We can reuse the getItems route without pagination params
  // Or you can create a new backend route if you prefer
  return api.get('/items?pageNumber=1&pageSize=1000'); // A simple way to get all
};

const getItemById = (id) => {
  return api.get(`/items/${id}`);
};

const createItem = (formData) => {
  // formData is expected to be a FormData object
  return api.post('/items', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// New function for admin to delete ANY item
const deleteItemAsAdmin = (id) => {
  return api.delete(`/items/admin/${id}`);
};

// Update and user-delete functions (optional but good practice)
const updateItem = (id, itemData) => {
  return api.put(`/items/${id}`, itemData);
};

const deleteMyItem = (id) => {
  return api.delete(`/items/${id}`);
};


const itemService = {
  getItems,
  getItemsForAdmin, // <-- Add this
  getItemById,
  createItem,
  updateItem,
  deleteMyItem,
  deleteItemAsAdmin, // <-- Add this
};

export default itemService;