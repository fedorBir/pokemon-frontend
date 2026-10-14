import { useEffect, useState } from 'react';

const STORAGE_KEY = 'pokemon-favorites';

const loadFavorites = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

// The ids of the user's favorite Pokemon, kept in localStorage so they survive a reload.
export const useFavorites = () => {
  const [favoriteIds, setFavoriteIds] = useState(loadFavorites);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const toggleFavorite = (id) => {
    setFavoriteIds(ids => (ids.includes(id) ? ids.filter(favoriteId => favoriteId !== id) : [...ids, id]));
  };

  return { favoriteIds, toggleFavorite };
};
