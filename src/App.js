import React, { useState, useEffect } from 'react';
import './App.css';
import PokemonCard from './components/PokemonCard';
import FilterBar from './components/FilterBar';
import LoadingSpinner from './components/LoadingSpinner';
import { DEFAULT_SORT, sortPokemons } from './sorting';
import { useFavorites } from './favorites';

// Empty in the Docker build: the app then calls its own /api, which nginx forwards to the backend.
const API_BASE_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:3001';

const EMPTY_FILTERS = {
  name: '',
  type: '',
  legendary: '',
  favoritesOnly: false,
  sort: DEFAULT_SORT
};

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [types, setTypes] = useState([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { favoriteIds, toggleFavorite } = useFavorites();

  // Fetch all Pokemon and types on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        const [pokemonResponse, typesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/pokemons`),
          fetch(`${API_BASE_URL}/api/types`)
        ]);

        if (!pokemonResponse.ok || !typesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const pokemonData = await pokemonResponse.json();
        const typesData = await typesResponse.json();

        setPokemons(pokemonData.data);
        setFilteredPokemons(pokemonData.data);
        setTypes(typesData.data);
        setError(null);
      } catch (err) {
        setError('Failed to load Pokemon data. Please make sure the backend server is running.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Apply filters whenever filters change
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...pokemons];

      // Filter by name
      if (filters.name) {
        filtered = filtered.filter(pokemon =>
          pokemon.name.toLowerCase().includes(filters.name.toLowerCase())
        );
      }

      // Filter by type
      if (filters.type) {
        filtered = filtered.filter(pokemon =>
          pokemon.type.some(t => t.toLowerCase() === filters.type.toLowerCase())
        );
      }

      // Filter by legendary status
      if (filters.legendary !== '') {
        const isLegendary = filters.legendary === 'true';
        filtered = filtered.filter(pokemon => pokemon.legendary === isLegendary);
      }

      // Show only favorites
      if (filters.favoritesOnly) {
        filtered = filtered.filter(pokemon => favoriteIds.includes(pokemon.id));
      }

      setFilteredPokemons(sortPokemons(filtered, filters.sort));
    };

    applyFilters();
  }, [filters, pokemons, favoriteIds]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
  };

  if (loading) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Pokemon Explorer</h1>
        </header>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Pokemon Explorer</h1>
        </header>
        <div className="error-container">
          <div className="error-message">
            <h2>⚠️ Connection Error</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-button">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Pokemon Explorer v2</h1>
        <p>Discover and filter your favorite Pokemon!</p>
        <div className="header-actions">
          <button className="jira-link-button">Link Jira Issue</button>
          <span className="favorites-count">
            ★ {favoriteIds.length} {favoriteIds.length === 1 ? 'favorite' : 'favorites'}
          </span>
        </div>
      </header>

      <main className="main-content">
        <FilterBar
          filters={filters}
          types={types}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />

        <div className="results-info">
          <p>
            Showing {filteredPokemons.length} of {pokemons.length} Pokemon
          </p>
        </div>

        {filteredPokemons.length === 0 && filters.favoritesOnly && favoriteIds.length === 0 ? (
          <div className="no-results">
            <h3>No favorites yet</h3>
            <p>Click the ☆ on a Pokemon card to add it to your favorites.</p>
            <button onClick={clearFilters} className="clear-button">
              Show All Pokemon
            </button>
          </div>
        ) : filteredPokemons.length === 0 ? (
          <div className="no-results">
            <h3>No Pokemon found</h3>
            <p>Try adjusting your filters to see more results.</p>
            <button onClick={clearFilters} className="clear-button">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="pokemon-grid">
            {filteredPokemons.map(pokemon => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                isFavorite={favoriteIds.includes(pokemon.id)}
                onToggleFavorite={() => toggleFavorite(pokemon.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
