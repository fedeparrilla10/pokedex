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
  const pokeContainer = document.querySelector(".poke-container");

  renderArray.forEach((pokemon) => {
    const eachPokemonContainer = document.createElement("div");
    const heartMark = document.createElement("i");
    const pokeId = document.createElement("h6");
    const pokeName = document.createElement("h3");
    const pokeImg = document.createElement("img");
    const pokeType = document.createElement("p");
    const pokeAbility = document.createElement("p");
    const { id, name, type, img, ability } = pokemon;

    pokeContainer.appendChild(eachPokemonContainer);
    eachPokemonContainer.classList.add("eachPokemon");

    eachPokemonContainer.appendChild(heartMark);
    heartMark.classList.add("fa-solid");
    heartMark.classList.add("fa-heart");

    eachPokemonContainer.appendChild(pokeId);
    pokeId.classList.add("poke-id");
    pokeId.innerText = `# ${id}`;

    eachPokemonContainer.appendChild(pokeName);
    pokeName.classList.add("poke-name");
    pokeName.innerText = `${name}`;

    eachPokemonContainer.appendChild(pokeImg);
    pokeImg.classList.add("poke-img");
    pokeImg.src = `${img}`;

    eachPokemonContainer.appendChild(pokeType);
    pokeType.classList.add("poke-type");
    pokeType.innerText = `${type}`;

    eachPokemonContainer.appendChild(pokeAbility);
    pokeAbility.classList.add("poke-ability");
    pokeAbility.innerText = `${ability}`;

    // container.insertAdjacentHTML(
    //   "beforeend",
    //   `<div class="eachPokemon">
    //     <i class="fa-solid fa-heart"></i>
    //     <h6 class="poke-id"># ${id}</h6>
    //     <h3 class="poke-name">${name}</h3>
    //     <img class="poke-img" src=${img}>
    //     <p class="poke-type">${type}</p>
    //     <p class="poke-ability">${ability}</p>
    //   </div>`
    // );
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
  const pokemonTeamSection = document.querySelector(".pokemon-team");
  let favouriteArray = [];

  const markAsFavourite = (ev) => {
    const pokeFav = ev.target.parentNode;
    const pokeName = pokeFav.querySelector(".poke-name").innerText;

    // Cambia el color del corazón

    const pokeHeartFav = ev.target.classList;
    const activeFav = pokeHeartFav.toggle("fa-heart-active");

    // Pushear Pokémon al Array
    !favouriteArray.includes(pokeName) &&
      activeFav &&
      favouriteArray.push(pokeName);

    // Eliminar Pokémon del Array

    const favIndex = favouriteArray.indexOf(pokeName);
    favIndex !== -1 && !activeFav && favouriteArray.splice(favIndex, 1);

    // Mostrar u ocultar el <section> que tiene dentro los Pokémon favoritos.

    favouriteArray.length > 0
      ? pokemonTeamSection.classList.add("pokemon-team-active")
      : pokemonTeamSection.classList.remove("pokemon-team-active");

    // Resetear el contenido del <section> cada vez que se actualiza para que no se repita el contenido del array una y otra vez.

    pokemonTeamSection.innerHTML = "";

    // Renderizar el contenido del <section> en base al array favouriteArray.

    favouriteArray.forEach((item) => {
      const h3 = document.createElement("h3");
      const article = document.createElement("article");
      const img = document.createElement("img");

      pokemonTeamSection.appendChild(article);

      article.classList.add("poke-favourite");

      article.appendChild(img);
      img.src = "./assets/img/pokeball.png";
      img.classList.add("fav-pokeball");

      article.appendChild(h3);
      h3.innerText = item;
      h3.classList.add("fav-pokename");
    });

    console.log(favouriteArray);
  };

  // Evento que activa con un click las anteriores funcionalidades.

  allHearts.forEach((heart) => {
    heart.addEventListener("click", markAsFavourite);
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

  choosePokemonTeam(fullData);
};

init();
