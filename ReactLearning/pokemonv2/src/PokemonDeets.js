import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PokemonDeets = ({ currentPokemon }) => {
    //const [loading, setLoading] = useState(true);
    const [abilities, setAbilities] = useState();
    const [images, setImages] = useState();
    const [showDetails, setShowDetails] = useState('false');

    const pokeUrl = 'https://pokeapi.co/api/v2/pokemon/' + currentPokemon;

    const toggleDetails = () => {
      setShowDetails(!showDetails);
    }

    useEffect(() => {
        //setLoading(true);
        let cancel;
        axios.get(pokeUrl, {
          cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
          //setLoading(false);
          setAbilities(res.data.abilities.map(a => a.ability.name));
          const PATTERN = "default";
          const sprites = res.data.sprites;
          const defaultSprites = Object.keys(sprites)
            .filter(key => key.includes(PATTERN))
            .reduce((obj, key) => {
                obj[key] = sprites[key];
                return obj;
            }, {});
            setImages(Object.values(defaultSprites))
        });
    
        return () => cancel();
      }, [pokeUrl]);

      let pics;
      if (images){
        pics = images.map(i => <img key={i} className="pic" src={i} alt="pokemon"></img>)
      } else {
          pics = <></>
      }

      let ability;
      if (abilities){
        // ability = abilities.map(a => <p>{a}</p>)
        ability = abilities.join(", ");
      } else {
          ability = <></>
      }

      let pokeDetails = null;

      if(!showDetails) {
        pokeDetails =  <>
          {pics}
          <p key={ability} className="abilities">Abilities: {ability}</p>
        </>
    }

    // if (loading) return "Loading...";
    
    return (
        <div className="onePokemon" onClick={toggleDetails}>
          <h3 className="pokeName">{currentPokemon}</h3>
          {pokeDetails}
        </div>
    )
}

export default PokemonDeets
