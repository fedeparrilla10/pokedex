// Pushear Pokémon al Array
export const pushPokemon = (array, creatureName, someActive) => {
  !array.includes(creatureName) && someActive && array.push(creatureName); // Si el array no contiene a la criatura y la funcionalidad que se chequea está activada, se agrega a dicha estructura.
};

// Eliminar Pokémon del Array
export const splicePokemon = (array, creatureName, someActive) => {
  const favIndex = array.indexOf(creatureName); // Buscamos el índice del argumento que pasemos.
  favIndex > -1 && !someActive && array.splice(favIndex, 1); // Si el elemento se encuentra presente en el array pero la funcionalidad que se chequea está desactivada, se elimina del mismo.
};

// Mostrar u ocultar el <section> que tiene dentro los Pokémon favoritos.
export const showSection = (array, classes, classString) => {
  array.length > 0 // Chequeamos que el array tenga elementos dentro.
    ? classes.classList.add(classString) // Si la condición nos devuelve true, añadimos una clase.
    : classes.classList.remove(classString); // Si la condición nos devuelve false, eliminamos una clase.
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
