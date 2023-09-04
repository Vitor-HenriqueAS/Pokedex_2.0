import React, { useEffect, useState } from 'react';
import Pokemon from "../types/pokemon-model";
import { fetchPokemon } from "../PokemonList/poke-api";
import styles from "./QuemEhPokemon.module.css";
import Image from 'next/image';
import ResultWindow from '@/components/ResultWindow';

interface PokemonIdProps {
  pokemonId: number;
}

interface PokemonWindowControlsProps extends PokemonIdProps{
  onBackClick: () => void;
  onContinueClick: () => void;
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
        title='Quem é esse Pokemon?' 
        width={150} height={150} 
        priority={true} 
      />
    </div>
  );
};

export const PokemonWindowControls: React.FC<PokemonWindowControlsProps> = (
  { pokemonId, onBackClick, onContinueClick }) => {
  
  const [randomPokemonData, setRandomPokemonData] = useState<{ id: number, name: string }[]>([]);
  const [scorePokemon, setScorePokemon] = useState(0);
  const [recordPokemon , setRecordPokemon] = useState(0);
  const [resultActive, setResultActive] = React.useState([
    {resultActiveWindow: false, result:false,  resultName: ''}
  ]);
  const matrizResult = [...resultActive]
  const [isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  function showLoader() {
    setIsLoading(true);
    loadData();
  }

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

         const pokemonData: { id: number, name: string}[] = await Promise.all(
          randomPokemon.map(async (pokemon: any) => {
            const id = await getPokemonIdFromUrl(pokemon.url);
            return { id, name: pokemon.name };
          })
        );

        pokemonData.splice(correctNameIndex, 0, {
          id: await getPokemonIdFromUrl(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`),
          name: await getPokemonNameById(pokemonId)
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
    const handleButtonClick = (id: number, nomePokemon: string) => {
      if (id === pokemonId) {
        matrizResult[0].resultActiveWindow = true
        matrizResult[0].result = true
        matrizResult[0].resultName = nomePokemon
        setScorePokemon(scorePokemon+1)
        scorePokemon+1 > recordPokemon ? setRecordPokemon(scorePokemon+1) : setRecordPokemon(recordPokemon)
        setResultActive(matrizResult)
      } else {
        matrizResult[0].resultActiveWindow = true
        matrizResult[0].result = false
        matrizResult[0].resultName = nomePokemon
        setScorePokemon(0)
        setResultActive(matrizResult)
      }
    };

    const buttonAction = (value: string) => {
      switch (value) {
        case "voltar":
          onBackClick();
          break;
        case "continuar":
          onContinueClick();
          showLoader();
          matrizResult[0].resultActiveWindow = false
          setResultActive(matrizResult)
          break;
        case "restart":
          onContinueClick();
          showLoader();
          matrizResult[0].resultActiveWindow = false
          setResultActive(matrizResult)
          break;
        default:
          console.log("Erro!")
      }
    }


    return (
      <div className={styles.poke_window_quemehpoke}>
        
        <div className={styles.score_pokemon}>
          <h4>Pontuação : {scorePokemon}</h4>
          <h6>Recorde : {recordPokemon}</h6>
        </div>

        { isLoading ? <div>Loading...</div> :
        
        resultActive[0].resultActiveWindow ?
          <ResultWindow 
            key={resultActive[0].resultName + scorePokemon}
            result={resultActive[0].result}
            resultNameWin={resultActive[0].resultName}
            onButtonClick={buttonAction}
           />
          :
          randomPokemonData.map((poke) => (
            <button
              key={poke.id}
              className={styles.quemehpoke_btns}
              onClick={() => handleButtonClick(poke.id, poke.name)}
            >
              {poke.name}
            </button>
          ))
        }
        
    </div>
    )
  }