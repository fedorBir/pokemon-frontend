import React from 'react';
import './PokemonCard.css';

const PokemonCard = ({ pokemon, isFavorite, onToggleFavorite }) => {
  const favoriteLabel = isFavorite
    ? `Remove ${pokemon.name} from favorites`
    : `Add ${pokemon.name} to favorites`;

  return (
    <div className={`pokemon-card ${pokemon.legendary ? 'legendary' : ''} ${isFavorite ? 'favorite' : ''}`}>
      <button
        type="button"
        className="favorite-button"
        onClick={onToggleFavorite}
        aria-label={favoriteLabel}
        aria-pressed={isFavorite}
        title={favoriteLabel}
      >
        {isFavorite ? '★' : '☆'}
      </button>
      <div className="pokemon-image-container">
        <img 
          src={pokemon.image} 
          alt={pokemon.name}
          className="pokemon-image"
          onError={(e) => {
            e.target.src = '/placeholder-pokemon.png';
          }}
        />
        {pokemon.legendary && <div className="legendary-badge">✨ Legendary</div>}
      </div>
      
      <div className="pokemon-info">
        <h3 className="pokemon-name">{pokemon.name}</h3>
        
        <div className="pokemon-types">
          {pokemon.type.map((type, index) => (
            <span 
              key={index} 
              className={`type-badge type-${type.toLowerCase()}`}
            >
              {type}
            </span>
          ))}
        </div>
        
        <div className="pokemon-id">#{pokemon.id.toString().padStart(3, '0')}</div>
      </div>
    </div>
  );
};

export default PokemonCard;
