import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { getImageUrl } from '../services/api';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ItemDetailsPage = () => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/items/${id}`);
        setItem(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch item.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/items/${item._id}`);
        toast.success('Item deleted successfully');
        navigate('/');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete item.');
      }
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!item) return null;

  // Check if the logged-in user is the owner or an admin
  const canEdit = user && (user._id === item.user || user.role === 'admin');

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={getImageUrl(item.image)}
            alt={item.title}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
            onError={(e) => {
              console.error('Image failed to load:', getImageUrl(item.image));
              e.target.style.display = 'none';
            }}
          />
        </div>
        <div className="flex flex-col">
          <span
            className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mb-3 w-max ${
              item.category === 'lost'
                ? 'bg-red-200 text-red-800'
                : 'bg-green-200 text-green-800'
            }`}
          >
            {item.category.toUpperCase()}
          </span>
          <h1 className="text-4xl font-bold mb-4">{item.title}</h1>
          <p className="text-gray-700 text-lg mb-6">{item.description}</p>

          <div className="space-y-3 text-gray-800">
            <p>
              <strong>Location:</strong> {item.location}
            </p>
            <p>
              <strong>Date:</strong> {new Date(item.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Status:</strong> <span className="font-semibold">{item.status.toUpperCase()}</span>
            </p>
            <p>
              <strong>Contact Name:</strong> {item.contactName}
            </p>
            <p>
              <strong>Contact Email:</strong>{' '}
              <a
                href={`mailto:${item.contactEmail}`}
                className="text-blue-600 hover:underline"
              >
                {item.contactEmail}
              </a>
            </p>
          </div>

          {canEdit && (
            <div className="mt-auto pt-6 flex space-x-4">
              {/* You would build an EditItemPage and link to it here */}
              {/* <Link to={`/edit-item/${item._id}`} className="py-2 px-6 bg-yellow-500 text-white font-semibold rounded-md shadow hover:bg-yellow-600">
                Edit
              </Link> */}
              <button
                onClick={handleDelete}
                className="py-2 px-6 bg-red-600 text-white font-semibold rounded-md shadow hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsPage;