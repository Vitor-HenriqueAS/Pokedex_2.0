import React, { useState, useEffect } from "react";
import Card from "./Card";
import Pokemon from "../types/pokemon-model";
import { fetchPokemon } from "./poke-api";
import styles from './PokemonList.module.css'

import * as Popover from '@radix-ui/react-popover';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

type PokemonListProps = {
  toggleView: () => void;
};

const PokemonList: React.FC<PokemonListProps> = ({ toggleView }) => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [missing, setMissing] = useState(131);
  const [limit, setLimit] = useState(20);
  const [isLoaded, setIsLoaded] = useState(false);
  const [initialCheckedIndex, setInitialCheckedIndex] = useState<number>(0);

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
        setLimit(20)
        setMissing(131) //  1 geracao 151 - newOffset 0 - primeiros 20
        break;
      case "2G":
        newOffset = 151;
        setLimit(20)
        setMissing(80) // 2 geracao 251 - newOffset 151 - primeiros 20
        break;
      case "3G":
        newOffset = 251;
        setLimit(20)
        setMissing(115) // 3 geracao 386 - newOffset 251 - primeiros 20
        break;
      case "4G":
        newOffset = 386;
        setLimit(20)
        setMissing(87) // 4 geracao 493 - newOffset 386 - primeiros 20
        break;
      case "5G":
        newOffset = 493;
        setLimit(20)
        setMissing(136) // 5 geracao 649 - newOffset 493 - primeiros 20
        break;
      default:
        newOffset = 0;
        setLimit(20)
        setMissing(131) // 1 geracao 151 - newOffset 0 - primeiros 20
        break;
    }

    setOffset(newOffset);
    setInitialCheckedIndex(generations.findIndex((generation) => generation === selectedGeneration));
  };

  function showMorePokemon() {
    setIsLoaded(false);
    if(missing > 0) {
      if(missing >= 20) {
        setLimit(20)
        setMissing(missing - 20)
      }else {
        setLimit(missing)
        setMissing(0)
      }
    } else{
      setLimit(0)
      toast.dismiss();
      toast.warn('Chegou ao FIM dessa Geração!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }

  const generations = ["1G", "2G", "3G", "4G", "5G"];

  return (
    <section className={styles.content}>
      <ToastContainer />
      <div className={styles.pokemon_generations}>

        <button
          type="button"
          onClick={toggleView}
          className={styles.btn_voltar}
        >
          ◀
          Voltar
        </button>

        {generations.map((generation, index) => (
          <React.Fragment key={generation}>
            <input
              type="radio"
              id={generation.toLowerCase()}
              name="generation"
              value={generation}
              onChange={handleGenerationChange}
              checked={index === initialCheckedIndex}
            />
            <label htmlFor={generation.toLowerCase()}>{`${generation.charAt(0)}° Geração`}</label>
          </React.Fragment>
        ))}
        
      </div>
  
      {pokemonList.length > 0 && (
        <ol id="pokemonList" className={styles.pokemons}>
          {pokemonList.map((pokemon) => (
            <Popover.Root key={pokemon.number}>
              <Popover.Trigger className={styles.popover_trigger}>
                <Card key={pokemon.number} pokemon={pokemon} />
              </Popover.Trigger>

              <Popover.Portal>
                <Popover.Content className={styles.popover_content}>
                  <div className={styles.popover_details_measures}>
                    <span> 
                      {pokemon.height * 10 >= 100 ? 
                      `Altura: ${pokemon.height / 10} M` 
                      : 
                      `Altura: ${pokemon.height * 10} Cm`}
                    </span>

                    <span>
                    {pokemon.weight * 10 >= 1000 ? 
                      `Peso: ${pokemon.weight / 10} Kg` 
                      : 
                      `Peso: ${pokemon.weight * 10} g`}
                    </span>

                  </div>
                  <div className={styles.popover_details_stats}>
                    <div>
                      <span>HP</span>
                      <span>{pokemon.stats[0]}</span>
                    </div>
                    <div>
                      <span>ATAQUE</span>
                      <span>{pokemon.stats[1]}</span>
                    </div>
                    <div>
                      <span>DEFESA</span>
                      <span>{pokemon.stats[2]}</span>
                    </div>
                    <div>
                      <span>ATAQUE ESPECIAL</span>
                      <span>{pokemon.stats[3]}</span>
                    </div>
                    <div>
                      <span>DEFESA ESPECIAL</span>
                      <span>{pokemon.stats[4]}</span>
                    </div>
                    <div>
                      <span>VELOCIDADE</span>
                      <span>{pokemon.stats[5]}</span>
                    </div>
                  </div>
                  <Popover.Arrow className={styles.popover_arrow} />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
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
