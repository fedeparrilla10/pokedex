// Pushear Pokémon al Array
export const pushPokemon = (array, creatureName, someActive) => {
  !array.includes(creatureName) && someActive && array.push(creatureName);
};

// Eliminar Pokémon del Array
export const splicePokemon = (array, creatureName, someActive) => {
  const favIndex = array.indexOf(creatureName);
  favIndex > -1 && !someActive && array.splice(favIndex, 1);
};

// Mostrar u ocultar el <section> que tiene dentro los Pokémon favoritos.
export const showSection = (array, classes, classString) => {
  array.length > 0
    ? classes.classList.add(classString)
    : classes.classList.remove(classString);
};

// Renderizar el contenido del <section> en base al array favouriteArray.
export const renderFavouriteContent = (array, section) => {
  section.innerHTML = '';

  array.forEach((item) => {
    const h3 = document.createElement('h3');
    const article = document.createElement('article');
    const img = document.createElement('img');

    section.appendChild(article);

    article.classList.add('poke-favourite');

    article.appendChild(img);
    img.src = './assets/img/pokeball.png';
    img.classList.add('fav-pokeball');

    article.appendChild(h3);
    h3.innerText = item;
    h3.classList.add('fav-pokename');
  });
};
