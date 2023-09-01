import React from "react";
import Pokemon from "../types/pokemon-model";
import Image from 'next/image';
import styles from './PokemonList.module.css'

interface CardProps {
  pokemon: Pokemon;
}

const Card: React.FC<CardProps> = ({ pokemon }) => {
  const { number, name, types, photo } = pokemon;

  return (
    <li
      id={number.toString()}
      className={`${styles.pokemon} ${styles[types[0]]}`}
    >
      <span className={styles.number}>#{number}</span>
      <span className={styles.name}>{name}</span>

      <div className={styles.detail}>
        <ol className={styles.types}>
          {types.map((type) => (
            <li key={type} className={`${styles.type} ${styles[type]}`}>
              {type}
            </li>
          ))}
        </ol>
        <Image
          src={photo}
          alt={name}
          width={100}
          height={70}
          priority={true}
				/>
      </div>
    </li>
  );
};

export default Card;
