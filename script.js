const searchBtn = document.getElementById('search-btn');
const pokemonInput = document.getElementById('pokemon-input');
const pokemonDetails = document.getElementById('pokemon-details');
const pokemonImage = document.getElementById('pokemon-image');
const pokemonName = document.getElementById('pokemon-name');
const pokemonId = document.getElementById('pokemon-id');
const pokemonType = document.getElementById('pokemon-type');
const pokemonHeight = document.getElementById('pokemon-height');
const pokemonWeight = document.getElementById('pokemon-weight');
const pokemonAbility = document.getElementById('pokemon-ability');
const pokemonMoves = document.getElementById('pokemon-moves');
const errorMessage = document.getElementById('error-message');
const soundBtn = document.getElementById('hear-sound'); 

let currentPokemonCryUrl = ''; 

soundBtn.addEventListener('click', () => {
  if (currentPokemonCryUrl) {
    const audio = new Audio(currentPokemonCryUrl);
    audio.play();
  } else {
    console.log("No Pokémon selected.");
  }
});

async function fetchPokemonData(pokemonName) {
  try {
    const lowercaseName = pokemonName.toLowerCase();
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${lowercaseName}`);
    if (!response.ok) {
      throw new Error('Pokemon not found.');
    }
    const data = await response.json();

    pokemonDetails.style.display = 'block';
    errorMessage.style.display = 'none';

    pokemonImage.src = data.sprites.front_default;
    pokemonName.textContent = data.name;
    pokemonId.textContent = data.id.toString().padStart(3, '0');
    pokemonHeight.textContent = (data.height / 10).toFixed(2) + ' m';
    pokemonWeight.textContent = (data.weight / 10).toFixed(2) + ' kg';

    pokemonAbility.textContent = '';
    data.abilities.forEach((ability, index) => {
      const abilityName = ability.ability.name;
      pokemonAbility.textContent += `${abilityName}`;

      if (index < data.abilities.length - 1) {
        pokemonAbility.textContent += ', ';
      }
    });

    //Get Pokemon Types
    pokemonType.textContent = '';
    data.types.forEach((type, index) => {
      pokemonType.textContent += type.type.name;
      if (index < data.types.length - 1) {
        pokemonType.textContent += ' / ';
      }
    });

    // Store the cry URL
    currentPokemonCryUrl = data.cries.latest; 

    // Display Base Moves
    const randomMoves = data.moves
      .map(move => move.move.name)
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

    pokemonMoves.innerHTML = '';
    randomMoves.forEach(moveName => {
      const listItem = document.createElement('li');
      listItem.textContent = moveName;
      pokemonMoves.appendChild(listItem);
    });

  } catch (error) {
    console.error('Error fetching Pokemon data:', error);
    pokemonDetails.style.display = 'none';
    errorMessage.style.display = 'block';
    errorMessage.textContent = 'Pokemon Not Found.'; 
  }
}

searchBtn.addEventListener('click', async () => {
  const pokemonName = pokemonInput.value.toLowerCase();
  await fetchPokemonData(pokemonName);
});
