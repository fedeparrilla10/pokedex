// Importamos el objeto pokeTypes para usarlo dentro de este documento sin ocupar demasiado espacio en el mismo.
import { pokeTypes } from "./types.js";

// Fetcheamos la URL que contiene los primeros 151 Pokémon. Los resultados nos muestran el nombre de cada uno de ellos + otra propiedad que contiene una segunda URL con más datos de cada uno.
const getData = async () => {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`);
    const data = await res.json();
    return data.results;
  } catch (error) {
    console.log("Error");
  }
};

// Mapeamos el array que nos devuelve la función getData para obtener una nueva estructura de datos que contenga los nombres de los Pokémon.
const mapEachPokemon = (generalArray) => {
  const newArray = generalArray.map((pokeName) => {
    return pokeName.name;
  });
  return newArray;
};

// Iteramos el array de los nombres para fetchear, con esos 151 elementos metidos como argumento en eachElement, consiguiendo de esta manera un tercer array. En este caso, vamos a tener todos los datos de cada uno de los Pokémon.
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

// Pasamos en limpio el array (ya que tenía muchísimas cosas que no nos interesaban). Rescatamos: id, nombre, tipo principal, imagen y habilidad.
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

// Empezamos a renderizarlo en el HTML. Hacemos un destructuring para facilitar las cosas y tener el código más limpio.
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
  });
};

// Creamos un filtro que permita buscar los Pokémon por nombre, filtrando aquellos que no coincidan con el input que ponga el usuario.
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

// Creamos un pequeño detalle que coloree una sombra en el nombre de los Pokémon dependiendo de su tipo.
const coloringEachPokemon = () => {
  const pokeType = document.querySelectorAll(".poke-type");

  pokeType.forEach((eachType) => {
    const typeName = eachType.textContent.toLowerCase();
    const typeClass = pokeTypes[typeName];
    const pokeClass = eachType.previousElementSibling.previousElementSibling;
    typeClass && (pokeClass.style.textShadow = `1px 1px ${typeClass}`);
  });
};

// Creamos funciones reutilizables para añadir y quitar Pokémon de una lista de favoritos.

// Pushear Pokémon al Array
const pushPokemon = (array, creatureName, someActive) => {
  !array.includes(creatureName) && someActive && array.push(creatureName); // Si el array no contiene a la criatura y la funcionalidad que se chequea está activada, se agrega a dicha estructura.
};

// Eliminar Pokémon del Array
const splicePokemon = (array, creatureName, someActive) => {
  const favIndex = array.indexOf(creatureName); // Buscamos el índice del argumento que pasemos.
  favIndex > -1 && !someActive && array.splice(favIndex, 1); // Si el elemento se encuentra presente en el array pero la funcionalidad que se chequea está desactivada, se elimina del mismo.
};

// Mostrar u ocultar el <section> que tiene dentro los Pokémon favoritos.
const showSection = (array, classes, classString) => {
  array.length > 0 // Chequeamos que el array tenga elementos dentro.
    ? classes.classList.add(classString) // Si la condición nos devuelve true, añadimos una clase.
    : classes.classList.remove(classString); // Si la condición nos devuelve false, eliminamos una clase.
};

// Renderizar el contenido del <section> en base al array favouriteArray.
const renderFavouriteContent = (array, section) => {
  section.innerHTML = "";

  array.forEach((item) => {
    const h3 = document.createElement("h3");
    const article = document.createElement("article");
    const img = document.createElement("img");

    section.appendChild(article);

    article.classList.add("poke-favourite");

    article.appendChild(img);
    img.src = "./assets/img/pokeball.png";
    img.classList.add("fav-pokeball");

    article.appendChild(h3);
    h3.innerText = item;
    h3.classList.add("fav-pokename");
  });
};

// Función principal para la lista de favoritos.
const choosePokemonTeam = () => {
  const allHearts = document.querySelectorAll(".fa-heart");
  const pokemonTeamSection = document.querySelector(".pokemon-team");
  const favouriteArray = [];

  // Función que maneja el evento cada vez que clickeemos en el corazón.
  const markAsFavourite = (ev) => {
    const pokeFav = ev.target.parentNode;
    const pokeName = pokeFav.querySelector(".poke-name").innerText;

    // Cambia el color del corazón
    const pokeHeartFav = ev.target.classList;
    const activeFav = pokeHeartFav.toggle("fa-heart-active"); // Pulsando en el elemento, activamos/desactivamos una clase cual interruptor.

    // Ejecutamos las funciones con los argumentos correspondientes.
    pushPokemon(favouriteArray, pokeName, activeFav);
    splicePokemon(favouriteArray, pokeName, activeFav);
    showSection(favouriteArray, pokemonTeamSection, "pokemon-team-active");
    renderFavouriteContent(favouriteArray, pokemonTeamSection);
  };

  allHearts.forEach((heart) => {
    heart.addEventListener("click", markAsFavourite);
  });
};

// La función init() inicializa todas las principales funciones del documento, para darle más prolijidad y una buena funcionalidad.

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

  // Ejecutamos la función para elegir el equipo Pokémon (favoritos).
  choosePokemonTeam();
};

init();
