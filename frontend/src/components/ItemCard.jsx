import React from 'react';
import { Link } from 'react-router-dom';

const ItemCard = ({ item }) => {
  const imageUrl = `http://localhost:5000${item.image}`;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <Link to={`/item/${item._id}`}>
        <img
          src={imageUrl}
          alt={item.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            console.error('Image failed to load:', imageUrl);
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
            e.target.onerror = null; // Prevent infinite loop
          }}
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
        <h3 className="text-xl font-semibold mb-2 truncate text-gray-900">
          <Link to={`/item/${item._id}`} className="text-gray-900 hover:text-blue-600">
            {item.title}
          </Link>
        </h3>
        {item.description && (
          <p className="text-gray-700 mb-2 text-sm" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
            {item.description}
          </p>
        )}
        <p className="text-gray-600 mb-2">
          <strong className="text-gray-800">Location:</strong> {item.location}
        </p>
        <p className="text-gray-500 text-sm">
          <strong className="text-gray-800">Date:</strong> {new Date(item.date).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default ItemCard;