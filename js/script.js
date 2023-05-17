// Modules
import { pokeTypes } from './types.js';
import {
  pushPokemon,
  splicePokemon,
  showSection,
  renderFavouriteContent,
} from './defaultFunctions.js';

// First fetch.
const getData = async () => {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`);
    const data = await res.json();
    return data.results;
  } catch (error) {
    console.log('Error');
  }
};

// Getting Pokémon names.
const mapEachPokemon = (generalArray) => {
  const newArray = generalArray.map((pokeName) => {
    return pokeName.name;
  });
  return newArray;
};

// Main data for each Pokémon.
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
    console.log('Error!');
  }
};

// Final array.
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

// Rendering
const renderPokemon = (renderArray) => {
  const pokeContainer = document.querySelector('.poke-container');

  renderArray.forEach((pokemon) => {
    const eachPokemonContainer = document.createElement('div');
    const heartMark = document.createElement('i');
    const pokeId = document.createElement('h6');
    const pokeName = document.createElement('h3');
    const pokeImg = document.createElement('img');
    const pokeType = document.createElement('p');
    const pokeAbility = document.createElement('p');
    const { id, name, type, img, ability } = pokemon;

    pokeContainer.appendChild(eachPokemonContainer);
    eachPokemonContainer.classList.add('eachPokemon');

    eachPokemonContainer.appendChild(heartMark);
    heartMark.classList.add('fa-solid');
    heartMark.classList.add('fa-heart');

    eachPokemonContainer.appendChild(pokeId);
    pokeId.classList.add('poke-id');
    pokeId.innerText = `# ${id}`;

    eachPokemonContainer.appendChild(pokeName);
    pokeName.classList.add('poke-name');
    pokeName.innerText = `${name}`;

    eachPokemonContainer.appendChild(pokeImg);
    pokeImg.classList.add('poke-img');
    pokeImg.src = `${img}`;

    eachPokemonContainer.appendChild(pokeType);
    pokeType.classList.add('poke-type');
    pokeType.innerText = `${type}`;

    eachPokemonContainer.appendChild(pokeAbility);
    pokeAbility.classList.add('poke-ability');
    pokeAbility.innerText = `${ability}`;
  });
};

// Filter
const filterSearch = () => {
  const filterInput = document.querySelector('#filter-pokemon');

  const filterPokemon = () => {
    const eachPokemonContainer = document.querySelectorAll('.eachPokemon');
    const inputValue = filterInput.value.toLowerCase();

    eachPokemonContainer.forEach((eachContainer) => {
      const pokeName = eachContainer.querySelector('.poke-name');

      pokeName.innerText.toLowerCase().indexOf(inputValue) > -1
        ? (eachContainer.style.display = '')
        : (eachContainer.style.display = 'none');
    });
  };
  filterInput.addEventListener('keyup', filterPokemon);
};

// Shadow
const coloringEachPokemon = () => {
  const pokeType = document.querySelectorAll('.poke-type');

  pokeType.forEach((eachType) => {
    const typeName = eachType.textContent.toLowerCase();
    const typeClass = pokeTypes[typeName];
    const pokeClass = eachType.previousElementSibling.previousElementSibling;
    typeClass && (pokeClass.style.textShadow = `1px 1px ${typeClass}`);
  });
};

// Favourite List
const choosePokemonTeam = () => {
  const allHearts = document.querySelectorAll('.fa-heart');
  const pokemonTeamSection = document.querySelector('.pokemon-team');
  const favouriteArray = [];

  const markAsFavourite = (ev) => {
    const pokeFav = ev.target.parentNode;
    const pokeName = pokeFav.querySelector('.poke-name').innerText;

    const pokeHeartFav = ev.target.classList;
    const activeFav = pokeHeartFav.toggle('fa-heart-active');

    pushPokemon(favouriteArray, pokeName, activeFav);
    splicePokemon(favouriteArray, pokeName, activeFav);
    showSection(favouriteArray, pokemonTeamSection, 'pokemon-team-active');
    renderFavouriteContent(favouriteArray, pokemonTeamSection);
  };

  allHearts.forEach((heart) => {
    heart.addEventListener('click', markAsFavourite);
  });
};

const init = async () => {
  const pokeData = await getData();
  const allNames = mapEachPokemon(pokeData);
  const allMainData = await getMainData(allNames);
  const fullData = cleanPokeData(allMainData);
  renderPokemon(fullData);
  filterSearch();
  coloringEachPokemon();
  choosePokemonTeam();
};

init();
