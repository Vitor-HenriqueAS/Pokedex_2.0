import React, { useState, useEffect } from 'react';
import styles from './Pokedex.module.css';
import { PokemonWindow, PokemonWindowControls, getRandomPokemonId } from '../QuemEhPokemon/pokedexCover';

type PokedexProps = {
  toggleView: () => void;
};

export default function Pokedex({ toggleView }: PokedexProps ) {
  const [isPokedexOpen, setPokedexOpen] = useState(false);
  const [showPokemonWindow, setShowPokemonWindow] = useState(false);
  const [randomPokemonId, setRandomPokemonId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Alterna entre abrir/fechar a Pokédex
  const handleClick = () => {
    setPokedexOpen(!isPokedexOpen);
  };

  // Manipula o clique no botão "Quem é esse Pokémon?"
  const handleClickPoke = () => {
    setShowPokemonWindow(!showPokemonWindow);
    setRandomPokemonId(getRandomPokemonId());
  };

  // Manipula o clique no botão de continuar
  const handleContinue = () => {
    setIsLoading(true);
    setRandomPokemonId(getRandomPokemonId());
    loadData();
  };
  
  return (
    <div className={styles.poke_body}>
          <div className={styles.poke_lights}>
            <div className={styles.lights_blue_circle}></div>
            <div className={styles.lights_yellow_circle}></div>
            <div className={styles.lights_red_circle}></div>
            <div className={styles.lights_green_circle}></div>
          </div>

          <div className={styles.poke_container}>
            <div className={`${styles.poke_content} ${isPokedexOpen ? styles.poke_content_active : ''}`}>
              
              <div className={styles.poke_content_window}>
                <div className={styles.poke_content_leds}>
                  <div className={styles.leds_red}></div>
                  <div className={styles.leds_red}></div>
                </div>
                <div className={styles.window_main}>
                  {!showPokemonWindow && (
                    <div className={styles.window_buttons}>
                      <button type='button' onClick={toggleView}>Ver Pokémons</button>
                      <button type='button' onClick={handleClickPoke}>Quem é esse Pokémon ?</button>
                    </div>
                  )}

                  {isLoading && showPokemonWindow ? 
                    <span>Loading...</span>
                  : 
                    showPokemonWindow &&  <PokemonWindow pokemonId={randomPokemonId}/> 
                  }
                </div>
                <div className={styles.poke_content_leds2}>
                  <div className={styles.leds_red}></div>
                  <div className={styles.leds_retangule}>
                    <div className={styles.line}></div>
                    <div className={styles.line}></div>
                    <div className={styles.line}></div>
                    <div className={styles.line}></div>
                  </div>
                </div>
              </div>

              <div className={styles.controls}>
                <button type='button' className={styles.leds_green}>
                  Enter
                </button>
                <div className={styles.controller}>
                  <div className={styles.coluna}>
                    <div className={`${styles.arrow} ${styles.up}`}>⬆</div>
                    <div className={`${styles.arrow} ${styles.down}`}>⬇</div>
                  </div>
                  <div className={styles.linha}>
                    <div className={`${styles.arrow} ${styles.left}`}>⬅</div>
                    <div className={`${styles.arrow} ${styles.right}`}>➡</div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${styles.poke_cover} ${isPokedexOpen ? styles.poke_cover_active : ''}`}>
              {!showPokemonWindow && 
              <div className={styles.cover_yellow_arrow} onClick={handleClick}>
                <span className={styles.poke_open_txt}>
                  {isPokedexOpen ? 'FECHAR POKÉDEX' : 'ABRIR POKÉDEX'}
                </span>
              </div>}

              <div>
                {showPokemonWindow && 
                  <PokemonWindowControls 
                    pokemonId={randomPokemonId} 
                    onBackClick={handleClickPoke}
                    onContinueClick={handleContinue}
                  /> 
                }
              </div> 
                    
            </div>
          </div>

        </div>
  )
}