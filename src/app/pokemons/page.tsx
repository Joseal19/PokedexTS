"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CardMedia, Card, Typography, Grid, TextField } from "@mui/material";

const ProductPage = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchPokemon, setSearchPokemon] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const url = searchPokemon ? `https://pokeapi.co/api/v2/pokemon/${searchPokemon}` : "https://pokeapi.co/api/v2/pokemon?limit=24";
      try {
        const response = await axios.get(url);
        console.log(response.data.results);

        if (response.data.results) {
          setPokemonList(response.data.results);
        } else {
          setPokemonList([response.data]);
        }
        console.log(response.data);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [searchPokemon]);


  return (
    <div style={{ backgroundImage: "url('/img/fundo.png')" }} className="grid grid-cols-1 gap-4 min-h-screen justify-items-center mt-auto p-10 ">
      <div className="col-span-1 bg-white h-14 w-19 rounded border">
        <TextField
        multiline
        id="outlined-multiline-flexible"
          value={searchPokemon}
          onChange={(event) => setSearchPokemon(event.target.value)}
          className="mx-2"
        />
      </div>

      <div>
        <Grid container spacing={2}>
          {pokemonList && pokemonList.length !== 0 ? (
            pokemonList.map((pokemon, index) => (
              <Grid item xs={5} sm={10} md={6} lg={searchPokemon ? 20 : 4} key={index}>
                <PokemonCard pokemonName={pokemon.name} />
              </Grid>
            ))
          ) : (
            <Typography variant="body1" component="div">
              No Pokémon found
            </Typography>
          )}
        </Grid>
      </div>

    </div>
  );

};

const PokemonCard = ({ pokemonName }) => {
  const [pokemonData, setPokemonData] = useState(null);
  const [pokemonImage, setPokemonImage] = useState(null);
  const [abilities, setAbilities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const responseData = response.data;
        const abilities = responseData.abilities.map(ability => ability.ability.name);

        setPokemonData(responseData);
        setAbilities(abilities);
        setPokemonImage(responseData.sprites.front_default);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [pokemonName]);

  return (
    <div className="flex flex-col h-full w-full items-center justify-between">
      <Card className="mt-10 w-full h-full">
        {pokemonData && (
          <div>
            {pokemonImage && (
              <CardMedia
                component="img"
                image={pokemonImage}
                alt={`Image of ${pokemonData.name}`}
                style={{ height: 200, objectFit: "contain" }}
              />
            )}
            <div className="ml-2">
              <Typography variant="h6" component="div">
                {pokemonData.name.toUpperCase()}
              </Typography>
              <Typography variant="body1" className="font-bold ml-10" component="div">
                Abilities
              </Typography>
              <Typography variant="body1" className="font-mono" component="div">
                {abilities.map((ability, index) => (
                  <div key={index}>{ability}</div>
                ))}
              </Typography>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProductPage;
