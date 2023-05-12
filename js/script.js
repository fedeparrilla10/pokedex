import { pokeTypes } from "./types.js";

const getData = async () => {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`);
    const data = await res.json();
    return data.results;
  } catch (error) {
    console.log("Error");
  }
};

const mapEachPokemon = (generalArray) => {
  const newArray = generalArray.map((pokeName) => {
    return pokeName.name;
  });
  return newArray;
};

const getMainData = async (detailsArray) => {
  try {
    const allData = await Promise.all(
      detailsArray.map(async (eachElement) => {
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${eachElement}/`
        );
        const data = await res.json();
        return data;
      })
    );
    return allData;
  } catch (error) {
    console.log("Error!");
  }
};

const cleanPokeData = (finalArray) => {
  const definitiveList = finalArray.map((poke) => {
    return {
      id: poke.id,
      name: poke.name,
      type: poke.types[0].type.name,
      img: poke.sprites.front_default,
      ability: poke.abilities[0].ability.name,
    };
  });
  return definitiveList;
};

const renderPokemon = (renderArray) => {
  const container = document.querySelector(".poke-container");

  renderArray.forEach((pokemon) => {
    const { id, name, type, img, ability } = pokemon;
    container.insertAdjacentHTML(
      "beforeend",
      `<div class="eachPokemon">
        <i class="fa-solid fa-heart"></i>
        <h6 class="poke-id"># ${id}</h6>
        <h3 class="poke-name">${name}</h3>
        <img class="poke-img" src=${img}>
        <p class="poke-type">${type}</p>
        <p class="poke-ability">${ability}</p>
      </div>`
    );
  });
};

const filterSearch = () => {
  const filterInput = document.querySelector("#filter-pokemon");

  const filterPokemon = () => {
    const eachPokemonContainer = document.querySelectorAll(".eachPokemon");
    const inputValue = filterInput.value.toLowerCase();

    eachPokemonContainer.forEach((eachContainer) => {
      const pokeName = eachContainer.querySelector(".poke-name");

      if (pokeName.innerText.toLowerCase().indexOf(inputValue) > -1) {
        eachContainer.style.display = "";
      } else {
        eachContainer.style.display = "none";
      }
    });
  };

  filterInput.addEventListener("keyup", filterPokemon);
};

const coloringEachPokemon = () => {
  const pokeType = document.querySelectorAll(".poke-type");

  pokeType.forEach((eachType) => {
    const typeName = eachType.textContent.toLowerCase();
    const typeClass = pokeTypes[typeName];
    const pokeClass = eachType.previousElementSibling.previousElementSibling;
    typeClass && (pokeClass.style.textShadow = `1px 1px ${typeClass}`);
  });
};

// FAVOURITE POKEMON

const choosePokemonTeam = () => {
  const allHearts = document.querySelectorAll(".fa-heart");

  allHearts.forEach((heart) => {
    const toggleHeart = () => {
      heart.classList.toggle("fa-heart-active");
    };

    heart.addEventListener("click", toggleHeart);
  });
};

// La función init() inicializa todas las funciones del documento, para darle prolijidad y una buena funcionalidad. No hay ninguna variable global.

const init = async () => {
  // Se guardan los datos que devuelve la función getData en una variable llamada pokeData. Esta función tiene un await ya que queremos esperar a que cumpla todas las promesas antes de continuar ejecutando código (hay un fetch).
  const pokeData = await getData();

  // Se guarda el array con los nombres de los 151 pokémon en la variable allNames.
  const allNames = mapEachPokemon(pokeData);

  // A partir de una iteración por los 151 nombres, sacamos las urls alternativas que contienen más información de los Pokémon. Lo guardamos en la variable allMainData. Esta función tiene un await ya que queremos esperar a que cumpla todas las promesas antes de continuar ejecutando código (hay un fetch).

  const allMainData = await getMainData(allNames);

  // Armamos nuestro propio array de datos y lo guardamos en fullData.
  const fullData = cleanPokeData(allMainData);

  // Ejecutamos la función de rendering con los datos que tenemos.
  renderPokemon(fullData);

  // Ejecutamos la función para aplicar el filtro de búsqueda.
  filterSearch();

  // Ejecutamos la función para colorear la sombra de cada Pokémon según su tipo.
  coloringEachPokemon();

  // Ejecutamos la función para poner en rojo los corazones cuando clickeemos para elegir un Pokémon como favorito.
  choosePokemonTeam();
};

init();
