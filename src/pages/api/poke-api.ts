import axios, { AxiosResponse } from 'axios';

export interface Pokemon {
  id: string;
  name: string;
  sprites: {
    other: {
      dream_world: {
        front_default: string;
      }
    }
  };
  types: { 
    type: {
      name: string
    } 
  }[];
}

export const getPokemon = async (id: number): Promise<Pokemon> => {
  try {
    const response: AxiosResponse<Pokemon> = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
