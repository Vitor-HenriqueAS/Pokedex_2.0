import React, { useState, useEffect } from "react";
import Card from "./Card";
import Pokemon from "../types/pokemon-model";
import { fetchPokemon } from "./poke-api";
import styles from './PokemonList.module.css'

type PokemonListProps = {
  toggleView: () => void;
};

const PokemonList: React.FC<PokemonListProps> = ({ toggleView }) => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded) return;

    const loadPokemonItems = async () => {
      const pokemonPromises: Promise<Pokemon>[] = [];
      const newOffset = offset + pokemonList.length;

      for (let i = newOffset; i < newOffset + limit; i++) {
        const pokemonId = i + 1;
        pokemonPromises.push(fetchPokemon(pokemonId));
      }

      try {
        const newPokemons = await Promise.all(pokemonPromises);
        setPokemonList((prevList) => {
          const filteredPokemons = newPokemons.filter(
            (pokemon) => !prevList.some((prevPokemon) => prevPokemon.number === pokemon.number)
          );
          return [...prevList, ...filteredPokemons];
        });
        setIsLoaded(true);
      } catch (error) {
        console.log(error);
      }
    };

    loadPokemonItems();
  }, [offset, limit, isLoaded, pokemonList]);

  const handleGenerationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedGeneration = event.target.value;
    setPokemonList([]);
    setIsLoaded(false);

    let newOffset = 0;
    switch (selectedGeneration) {
      case "1G":
        newOffset = 0;
        setLimit(10)
        break;
      case "2G":
        newOffset = 151;
        setLimit(10)
        break;
      case "3G":
        newOffset = 251;
        setLimit(10)
        break;
      case "4G":
        newOffset = 386;
        setLimit(10)
        break;
      case "5G":
        newOffset = 493;
        setLimit(10)
        break;
      default:
        newOffset = 0;
        setLimit(10)
        break;
    }

    setOffset(newOffset);
  };

  function showMorePokemon() {
    setIsLoaded(false);
    setLimit(limit+10)
  }

  return (
    <section className={styles.content}>
      <div className={styles.pokemon_generations}>

        <button
          type="button"
          onClick={toggleView}
          className={styles.btn_voltar}
        >
          ◀
          Voltar
        </button>

        <input
          type="radio"
          id="1g"
          name="generation"
          value="1G"
          defaultChecked
          onChange={handleGenerationChange}
        />
        <label htmlFor="1g">1° Geração</label>
  
        <input
          type="radio"
          id="2g"
          name="generation"
          value="2G"
          onChange={handleGenerationChange}
        />
        <label htmlFor="2g">2° Geração</label>
  
        <input
          type="radio"
          id="3g"
          name="generation"
          value="3G"
          onChange={handleGenerationChange}
        />
        <label htmlFor="3g">3° Geração</label>
  
        <input
          type="radio"
          id="4g"
          name="generation"
          value="4G"
          onChange={handleGenerationChange}
        />
        <label htmlFor="4g">4° Geração</label>
  
        <input
          type="radio"
          id="5g"
          name="generation"
          value="5G"
          onChange={handleGenerationChange}
        />
        <label htmlFor="5g">5° Geração</label>
      </div>
  
      {pokemonList.length > 0 && (
        <ol id="pokemonList" className={styles.pokemons}>
          {pokemonList.map((pokemon) => (
            <Card key={pokemon.number} pokemon={pokemon} />
          ))}
        </ol>
      )}

      <button 
        type="button" 
        className={styles.btnVerMais}
        onClick={showMorePokemon}
      >
          - Ver Mais -
      </button>

    </section>
  );
};

export default PokemonList;
