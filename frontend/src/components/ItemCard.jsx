import React from 'react';
import { Link } from 'react-router-dom';

const ItemCard = ({ item }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <Link to={`/item/${item._id}`}>
        <img
          src={`http://localhost:5000${item.image}`} // Adjust host as needed
          alt={item.title}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <span
          className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mb-2 ${
            item.category === 'lost'
              ? 'bg-red-200 text-red-800'
              : 'bg-green-200 text-green-800'
          }`}
        >
          {item.category.toUpperCase()}
        </span>
        <h3 className="text-xl font-semibold mb-2 truncate">
          <Link to={`/item/${item._id}`} className="hover:text-blue-600">
            {item.title}
          </Link>
        </h3>
        <p className="text-gray-600 mb-2">
          <strong>Location:</strong> {item.location}
        </p>
        <p className="text-gray-500 text-sm">
          <strong>Date:</strong> {new Date(item.date).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default ItemCard;