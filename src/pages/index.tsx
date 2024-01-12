import React, { useState } from 'react';
import Head from 'next/head'
import Pokedex from '@/components/Pokedex'
import PokemonList from '@/components/PokemonList';

export default function Home() {

  const [showPokedex, setShowPokedex] = useState(true);

  const toggleView = () => {
    setShowPokedex(!showPokedex);
  }

  return (
    <>
      <Head>
        <title>Pokédex 2.0 | Vitor</title>
        <meta name="description" content="Bem-vindo a Pokédex 2.0 | Vitor, o destino definitivo para todos os treinadores Pokémon que desejam aprimorar seu conhecimento sobre os monstrinhos de bolso e testar suas habilidades de identificação! Este site combina a riqueza de informações da Pokédex com um desafio interativo de adivinhação para proporcionar uma experiência única e envolvente." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/pokebola.png" type="image/x-icon" />
      </Head>
      <header>
        <h1>POKÉDEX 2.0</h1>
      </header>
      <main>

      {showPokedex ? (
          <Pokedex toggleView={toggleView} />
        ) : (
          <PokemonList toggleView={toggleView} />
        )}

      </main>

      <footer>
        <a href="https://portifolio-vitor-henriqueas.vercel.app/" target='_blank'>
        &copy; 2023 | Vitor-Henriqueas
        </a>
      </footer>
    </>
  )
}
