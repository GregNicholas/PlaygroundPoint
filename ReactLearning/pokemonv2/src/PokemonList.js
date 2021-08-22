import React from 'react';
import PokemonDeets from './PokemonDeets';

const PokemonList = ({ pokemon, allPokemon, filterText }) => {
    const searchedPokemon = [];

    if(filterText){
        allPokemon.forEach((poke) => {
            if (poke.toLowerCase().indexOf(filterText.toLowerCase()) === -1){
                return;
            }
            searchedPokemon.push(
                <PokemonDeets
                    className="onePoke"
                    currentPokemon={poke}
                    key={poke}
                />
            );
        });
    }

    if(searchedPokemon.length < 1){
        return (
            <div className="col">
                {pokemon.map(p => (
                    <PokemonDeets className="onePoke" currentPokemon={p} key={p} />
                ))}
            </div>
        )
    } 

    return (
        <div className="col">
            {searchedPokemon}
        </div>
    )
}

export default PokemonList
