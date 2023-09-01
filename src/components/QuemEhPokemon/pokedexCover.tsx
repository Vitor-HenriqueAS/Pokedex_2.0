import React, { useEffect, useState } from 'react';
import Pokemon from "../types/pokemon-model";
import { fetchPokemon } from "../PokemonList/poke-api";
import styles from "./QuemEhPokemon.module.css";
import Image from 'next/image';
import axios from "axios";

interface PokemonIdProps {
  pokemonId: number;
}

//Pokemon aleatorio
export const getRandomPokemonId = (): number => {
  return Math.floor(Math.random() * 600) + 1;
};

//Tela da esquerda (Quem é esse Pokemon?), sendo a imagem do pokemon
export const PokemonWindow: React.FC<PokemonIdProps> = ({ pokemonId }) => {
  const [pokemon, setPokemon] = React.useState<Pokemon | null>(null);

  React.useEffect(() => {
    const fetchRandomPokemon = async (pokemonId: number) => {
      try {
        const randomPokemon = await fetchPokemon(pokemonId);
        setPokemon(randomPokemon);
      } catch (error) {
        console.error("Falha ao buscar Pokémon aleatórios _ ", error);
      }
    };

    fetchRandomPokemon(pokemonId);
  }, [pokemonId]);

  if (!pokemon) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Image 
        src={pokemon.photo}
        alt='Quem é esse Pokemon?' 
        title={pokemonId.toString()} 
        width={150} height={150} 
        priority={true} 
      />
    </div>
  );
};

export const PokemonWindowControls: React.FC<PokemonIdProps> = ({ pokemonId }) => {
  
  const [randomPokemonData, setRandomPokemonData] = useState<{ id: number, name: string, photo: string }[]>([]);
  
  useEffect(() => {
    const getRandomPokemonData = async () => {
      try {

        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=600');
        const data = await response.json();
        const allPokemon = data.results;

        // Embaralha a matriz de Pokémon usando o algoritmo de Fisher-Yates
        for (let i = allPokemon.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allPokemon[i], allPokemon[j]] = [allPokemon[j], allPokemon[i]];
        }

        const randomPokemon = allPokemon.slice(0, 3);
        const correctNameIndex = Math.floor(Math.random() * 4);

         const pokemonData: { id: number, name: string, photo: string}[] = await Promise.all(
          randomPokemon.map(async (pokemon: any) => {
            const id = await getPokemonIdFromUrl(pokemon.url);
            return { id, name: pokemon.name };
          })
        );

        pokemonData.splice(correctNameIndex, 0, {
          id: await getPokemonIdFromUrl(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`),
          name: await getPokemonNameById(pokemonId),
          photo: await getPokemonImgFromUrl(pokemonId)
        });

        setRandomPokemonData(pokemonData);
      } catch (error) {
        console.error("Falha ao buscar Pokémon", error);
      }
    };

    const getPokemonIdFromUrl = async (url: string): Promise<number> => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        return data.id;
      } catch (error) {
        console.error(`Falha ao buscar o ID do Pokémon para URL ${url}`, error);
        return 0;
      }
    };

    const getPokemonImgFromUrl = async (pokemonId: number): Promise<string> => {
      try {        
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-form/${pokemonId}`);
        const data = await response.data;
        return data.sprites.front_default;
      } catch (error) {
        console.error(`Falha ao buscar imagem do Pokémon ${pokemonId}`, error);
        return "Imagem não Encontrada";
      }
  };

  const getPokemonNameById = async (pokemonId: number): Promise<string> => {
    try { 
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const data = await response.json();
    return data.name;
  } catch (error) {
    console.error(`Falha ao buscar Pokémon com ID ${pokemonId}`, error);
    return "Nome não Encontrado";
  }
};

  getRandomPokemonData();
}, [pokemonId]);


  //Função para lidar com o clique do botão
    const handleButtonClick = (id: number, nomePokemon: string, imagemPokemon: string) => {
      if (id === pokemonId) {
        alert("Acertou | " + nomePokemon);
        console.log(imagemPokemon);
      } else {
        alert("Errou | " + nomePokemon);
      }
    };


    return (
      <div className={styles.poke_window_quemehpoke}>
        {randomPokemonData.map((poke) => (
        <button
          key={poke.id}
          className={styles.quemehpoke_btns}
          onClick={() => handleButtonClick(poke.id, poke.name, poke.photo)}
        >
          {poke.name}
        </button>
      ))}
    </div>
    )
  }