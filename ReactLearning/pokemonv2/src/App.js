import React, { useState, useEffect } from 'react';
import PokemonList from './PokemonList';
import Pagination from './Pagination';
import SearchBar from './SearchBar';
import axios from 'axios';

function App() {
  const [pokemonPage, setPokemonPage] = useState([]);
  const [allPokemon, setAllPokemon] = useState([]);
  const [currentPageUrl, setCurrentPageUrl] = useState("https://pokeapi.co/api/v2/pokemon");
  const [nextPageUrl, setNextPageUrl] = useState();
  const [previousPageUrl, setPreviousPageUrl] = useState();
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');

  const fullPokeUrl = "https://pokeapi.co/api/v2/pokemon?limit=10000";

  useEffect(() => {
    setLoading(true);
    let cancel;
    axios.get(currentPageUrl, {
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(res => {
      setLoading(false);
      setNextPageUrl(res.data.next);
      setPreviousPageUrl(res.data.previous);
      setPokemonPage(res.data.results.map(p => p.name));
    });

    return () => cancel();
  }, [currentPageUrl]);

  useEffect(() => {
    setLoading(true);
    let cancel;
    axios.get(fullPokeUrl, {
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(res => {
      setLoading(false);
      setAllPokemon(res.data.results.map(p => p.name));
    });

    return () => cancel();
  }, [fullPokeUrl]);

  const goToNextPage = () => {
    setCurrentPageUrl(nextPageUrl);
  }

  const goToPreviousPage = () => {
    setCurrentPageUrl(previousPageUrl);
  }

  const handleFilterTextChange = filterText => {
    setFilterText(filterText);
  }

  if (loading) return "Loading...";

  let pageButtons = null;
  if (!filterText) {
    pageButtons = (<Pagination goToNextPage={nextPageUrl ? goToNextPage : null} goToPreviousPage={previousPageUrl ? goToPreviousPage : null} />)
  }

  return (
    <>
    <SearchBar onFilterTextChange={handleFilterTextChange} />
    <PokemonList pokemon={pokemonPage} allPokemon={allPokemon} filterText={filterText} />
    {pageButtons}
    </>
  );
}

export default App;
