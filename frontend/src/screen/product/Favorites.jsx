import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites, removeFavorite } from '../../redux/features/favoritesSlice';
import { ProductCard } from '../../components/cards/ProductCard';

export const Favorites = () => {
  const dispatch = useDispatch();
  const { items: favorites = [], status } = useSelector((state) => state.favorites);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  if (status === 'loading') return <p>Loading...</p>;

  const displayFavorites = Array.isArray(favorites) ? favorites : [];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Favorite Auctions</h2>
      {displayFavorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displayFavorites.map((item) => (
            <ProductCard 
              key={item._id || item.id} 
              item={item}
            />
          ))}
        </div>
      )}
    </div>
  );
};
