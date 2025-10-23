import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    category: '',
    location: '',
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/items', {
          params: {
            pageNumber: page,
            ...searchParams,
          },
        });
        setItems(data.items);
        setPage(data.page);
        setPages(data.pages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [page, searchParams]); // Refetch when page or search params change

  const handleSearch = (params) => {
    setSearchParams(params);
    setPage(1); // Reset to first page on new search
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Lost & Found Hub
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Reunite with your lost items or help others find theirs. A community-driven platform for lost and found items.
          </p>
          <div className="flex justify-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
              <span className="text-2xl font-bold">{items.length}</span>
              <p className="text-sm text-blue-100">Active Items</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
              <span className="text-2xl font-bold">24/7</span>
              <p className="text-sm text-blue-100">Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold mb-6 text-white text-center">Latest Items</h2>
          <SearchBar onSearch={handleSearch} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {items.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 text-lg">No items found.</div>
                <p className="text-gray-500 mt-2">Try adjusting your search criteria.</p>
              </div>
            ) : (
              items.map((item) => <ItemCard key={item._id} item={item} />)
            )}
          </div>

          <div className="mt-8">
            <Pagination currentPage={page} totalPages={pages} onPageChange={setPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;