import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const CreateItemPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'lost',
    date: '',
    location: '',
    contactName: '',
    contactEmail: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { title, description, category, date, location, contactName, contactEmail } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error('Please upload an image.');
      return;
    }

    setLoading(true);
    console.log('Submitting item with data:', { title, description, category, date, location, contactName, contactEmail });

    // We must use FormData to send files
    const postData = new FormData();
    postData.append('title', title);
    postData.append('description', description);
    postData.append('category', category);
    postData.append('date', date);
    postData.append('location', location);
    postData.append('contactName', contactName);
    postData.append('contactEmail', contactEmail);
    postData.append('image', image); // 'image' must match backend middleware

    try {
      console.log('Sending request to /items endpoint...');
      const { data } = await api.post('/items', postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Item created successfully:', data);
      toast.success('Item posted successfully!');
      navigate(`/item/${data._id}`); // Redirect to the new item's page
    } catch (err) {
      console.error('Error creating item:', err);
      console.error('Error response:', err.response?.data);
      toast.error(err.response?.data?.message || 'Failed to post item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Post a New Item</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input type="text" name="title" id="title" value={title} onChange={onChange} required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" id="description" value={description} onChange={onChange} required rows="4"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
        </div>
        
        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select name="category" id="category" value={category} onChange={onChange} required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
          <input type="date" name="date" id="date" value={date} onChange={onChange} required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <input type="text" name="location" id="location" value={location} onChange={onChange} required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </div>

        {/* Contact Name */}
        <div>
          <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">Contact Name</label>
          <input type="text" name="contactName" id="contactName" value={contactName} onChange={onChange} required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </div>

        {/* Contact Email */}
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">Contact Email</label>
          <input type="email" name="contactEmail" id="contactEmail" value={contactEmail} onChange={onChange} required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </div>

        {/* ... Other fields: description, date, location, contactName, contactEmail ... */}

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
          <input type="file" name="image" id="image" onChange={onFileChange} required accept="image/*"
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 disabled:bg-gray-400">
          {loading ? 'Submitting...' : 'Submit Post'}
        </button>
      </form>
    </div>
  );
};

export default CreateItemPage;