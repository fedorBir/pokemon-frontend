export const DEFAULT_SORT = 'id';

const SORTERS = {
  id: (a, b) => a.id - b.id,
  'name-asc': (a, b) => a.name.localeCompare(b.name),
  'name-desc': (a, b) => b.name.localeCompare(a.name)
};

// Returns a sorted copy of the Pokemon list; an unknown sort falls back to Pokedex number.
export const sortPokemons = (pokemons, sort) =>
  [...pokemons].sort(SORTERS[sort] || SORTERS[DEFAULT_SORT]);
