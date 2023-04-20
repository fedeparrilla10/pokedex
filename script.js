const getData = async (id) => {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json();
    const pokemon = data.name;
    const sprite = data.sprites.front_default;
    const type = data.types[0].type.name;
    const abilities = data.abilities[0].ability.name;
    console.log(data.name);
    const pokemonHTML = `<div class="pokemonClass">
    <h2>${pokemon}</h2>
    <img src="${sprite}" />
    <p class="poketype">${type}</p>
    <p>${abilities}</p>
    </div>`;

    const pokeContainer = document.querySelector(".poke-container");
    pokeContainer.innerHTML += pokemonHTML;

    const changeStyle = () => {
      const typeClasses = {
        grass: "#2DFF66",
        fire: "#FF1B1B",
        water: "#00DCFF",
        bug: "#428530",
        normal: "#FFFEB0",
        poison: "#6F0078",
        electric: "#F6DC00",
        ground: "#845600",
        fairy: "#F000FF",
        fighting: "#810000",
        psychic: "#CA41BF",
        ghost: "#784A74",
        rock: "#888888",
        ice: "#BAFCFF",
        dragon: "#6C00FF",
      };

      const pokeType = document.querySelectorAll(".poketype");
      pokeType.forEach((type) => {
        const typeName = type.textContent.toLowerCase();
        const typeClass = typeClasses[typeName];
        if (typeClass) {
          type.style.backgroundColor = typeClass;
        }
      });
    };

    changeStyle();
  } catch (err) {
    console.log("Error");
  }
};

const correctOrder = async () => {
  for (let id = 1; id <= 151; id++) {
    await getData(id);
  }
};

correctOrder();
