import Pokemon from "../types/pokemon-model";
import axios from "axios";

export async function fetchPokemon(pokemonId: number): Promise<Pokemon> {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const pokemonData = response.data;
    console.log(pokemonData)

    const pokemon: Pokemon = {
      number: pokemonData.id,
      name: pokemonData.name,
      type: pokemonData.types[0].type.name,
      types: pokemonData.types.map((type: any) => type.type.name),
      photo: pokemonData.sprites.other.dream_world.front_default,
      weight: pokemonData.weight,
	    height: pokemonData.height,
      stats: pokemonData.stats.map((status: any) => status.base_stat)
    };

    return pokemon;
  } catch (error) {
    console.error('Falha ao buscar Pokémon', error);
    throw error;
  }
}
