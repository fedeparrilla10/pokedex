import { pokeTypes } from "./types.js";

// Realizamos la petición a la PokéAPI. Utilizamos el método de async/await para manejar las promesas que nos devuelve la API.

const getData = async () => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`);
  const data = await res.json();
  console.log(data);
  return data.results;
};

// Mapeamos el array que nos devuelve data.results (sus datos están almacenados en una variable) para sacar una segunda estructura que contenga únicamente los nombres de los pokémon.

const mapEachPokemon = (generalArray) => {
  const newArray = generalArray.map((pokeName) => {
    return pokeName.name;
  });
  return newArray;
};

// Ahora que tenemos el array con todos los nombres, hacemos un segundo fetching para traernos la información detallada de cada una de las criaturas. La variable eachPokemon, pasada como argumento en el map, alterará la URL cada vez que se realice una iteración, pasando así por cada uno de los 151 elementos de la estructura de datos (Bulbasaur, Ivysaur, Venusaur, etc...). Utilizamos el Promise.all para que genere una promesa por cada petición que hagamos.

const getMainData = async (pokeName) => {
  const allData = await Promise.all(
    pokeName.map(async (eachPokemon) => {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${eachPokemon}/`
      );
      const data = await res.json();
      return data;
    })
  );
  return allData;
};

// Ya tenemos un array con la información detallada de cada uno de los pokémon, pero solo nos interesan algunas de las propiedades. Las vamos a filtrar creando un objeto dentro del array definitivo, generado por el .map.

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

// Con los datos definitivos, procedemos a renderizar nuestro HTML. Realizamos previamente un destructuring para trabajar más limpia y cómodamente.

const renderPokemon = (renderArray) => {
  const container = document.querySelector(".poke-container");

  renderArray.forEach((pokemon) => {
    const { id, name, type, img, ability } = pokemon;
    container.insertAdjacentHTML(
      "beforeend",
      `<div class="eachPokemon">
    <h6 class="poke-id"># ${id}</h6>
    <h3 class="poke-name">${name}</h3>
    <img class="poke-img" src=${img}>
    <p class="poke-type">${type}</p>
    <p class="poke-ability">${ability}</p>
    </div>`
    );
  });
};

/* Agregamos un filtro de búsqueda con un input que sea manejado por un evento keyup. Cada vez que el usuario teclee en dicho input, se ejecutará la función filterPokemon, la cual sigue los siguientes pasos: 

1) Selecciona todos los divs generados por el renderizado anterior. 
2) Tomamos el valor del input (lo que escriba el usuario en él) y lo transformamos a lowercase, con el objetivo de que el buscador de la app no distinga entre mayúsculas y minúsculas a la hora de buscar un pokémon.
3) Hacemos un bucle e iteramos por todos los eachPokemon.
4) Por cada iteración, seleccionamos el .poke-name de cada uno de los eachContainer que van pasando.
5) Si el índice de inputvalue corresponde con el nombre del pokémon (al cual también le convertimos el nombre a minúsculas para que no haya comparaciones de tipo mayus-minus) va a mostrarlos en pantalla, de lo contrario hay un display: none para ocultarlos (siempre que el índice no se encuentre, el indexOf devuelve -1).
*/

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

// Coloreamos la sombra de los nombres de los pokémon. Para esto vamos a asignar un color a cada uno de los tipos (fuego, agua, planta...). Se creó un objeto en otro archivo y lo importamos al principio de este documento.

const coloringEachPokemon = () => {
  const pokeType = document.querySelectorAll(".poke-type");

  pokeType.forEach((eachType) => {
    const typeName = eachType.textContent.toLowerCase();
    const typeClass = pokeTypes[typeName];
    const pokeClass = eachType.previousElementSibling.previousElementSibling;
    typeClass && (pokeClass.style.textShadow = `1px 1px ${typeClass}`);
  });
};

// La función init() inicializa todas las funciones del documento, para darle prolijidad y una buena funcionalidad. No hay ninguna variable global.

const init = async () => {
  const pokeData = await getData();

  const allPokeData = mapEachPokemon(pokeData);

  const allMainData = await getMainData(allPokeData);

  const fullData = cleanPokeData(allMainData);

  renderPokemon(fullData);

  filterSearch();
  coloringEachPokemon();
};

init();
