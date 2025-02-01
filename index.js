/*****************************************************************************
 * Import Data and Set Up JSON Parsing
 *****************************************************************************/

// Import the JSON data about the crowdfunded games from the games.js file
import GAMES_DATA from './games.js';

// Create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA);

/*****************************************************************************
 * Utility Functions
 *****************************************************************************/

// Remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Display All Games on the Page
 *****************************************************************************/

// Grab the element with the id "games-container"
const gamesContainer = document.getElementById("games-container");

// Function to display all games
function addGamesToPage(games) {
    deleteChildElements(gamesContainer);

    for (let i = 0; i < games.length; i++) {
        const game = games[i];

        // Create a new div element for the game card
        const gameCard = document.createElement("div");
        gameCard.classList.add("game-card");

        // Set the inner HTML using a template literal
        gameCard.innerHTML = `
            <img class="game-img" src="${game.img}" alt="${game.name}" />
            <h3>${game.name}</h3>
            <p>${game.description}</p>
            <p><strong>Pledged:</strong> $${game.pledged.toLocaleString()}</p>
            <p><strong>Backers:</strong> ${game.backers}</p>
        `;

        // Append the game to the games-container
        gamesContainer.appendChild(gameCard);
    }
}

// Initially display all games
addGamesToPage(GAMES_JSON);

/*****************************************************************************
 * Challenge 4: Update Stats Section
 *****************************************************************************/

// Grab the stats section elements
const contributionsCard = document.getElementById("num-contributions");
const raisedCard = document.getElementById("total-raised");
const gamesCard = document.getElementById("num-games");

// Calculate and display total contributions (number of backers)
const totalContributions = GAMES_JSON.reduce((acc, game) => acc + game.backers, 0);
contributionsCard.innerHTML = totalContributions.toLocaleString();

// Calculate and display total money raised
const totalRaised = GAMES_JSON.reduce((acc, game) => acc + game.pledged, 0);
raisedCard.innerHTML = `$${totalRaised.toLocaleString()}`;

// Display total number of games
gamesCard.innerHTML = GAMES_JSON.length;

/*****************************************************************************
 * Challenge 5: Add Functions for Filtering Games
 *****************************************************************************/

// Show only games that do not yet have enough funding
function filterUnfundedOnly() {
    const unfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal);
    addGamesToPage(unfundedGames);
}

// Show only games that are fully funded
function filterFundedOnly() {
    const fundedGames = GAMES_JSON.filter(game => game.pledged >= game.goal);
    addGamesToPage(fundedGames);
}

// Show all games
function showAllGames() {
    addGamesToPage(GAMES_JSON);
}

// Grab filter buttons and add event listeners
document.getElementById("unfunded-btn").addEventListener("click", filterUnfundedOnly);
document.getElementById("funded-btn").addEventListener("click", filterFundedOnly);
document.getElementById("all-btn").addEventListener("click", showAllGames);

/*****************************************************************************
 * Challenge 6: Add Summary Text Using Ternary Operator
 *****************************************************************************/

// Grab the description container
const descriptionContainer = document.getElementById("description-container");

// Calculate the number of unfunded games
const numUnfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal).length;

// Create a summary message
const summaryMessage = `A total of $${totalRaised.toLocaleString()} has been raised for ${GAMES_JSON.length} games. 
Currently, ${numUnfundedGames} ${numUnfundedGames === 1 ? "game remains" : "games remain"} unfunded. We need your help to fund more games!`;

// Create a new paragraph element and add the summary text
const summaryParagraph = document.createElement("p");
summaryParagraph.innerText = summaryMessage;
descriptionContainer.appendChild(summaryParagraph);

/*****************************************************************************
 * Challenge 7: Display Top 2 Most Funded Games
 *****************************************************************************/

// Grab elements for the top funded games
const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

// Sort games by funding amount (descending order)
const sortedGames = [...GAMES_JSON].sort((a, b) => b.pledged - a.pledged);

// Destructure to get the top two games
const [topGame, secondTopGame] = sortedGames;

// Create elements to display the top funded games
const firstGameElement = document.createElement("p");
firstGameElement.innerText = topGame.name;
firstGameContainer.appendChild(firstGameElement);

const secondGameElement = document.createElement("p");
secondGameElement.innerText = secondTopGame.name;
secondGameContainer.appendChild(secondGameElement);

/*****************************************************************************
 * Custom Feature 1: Add Search Functionality
 *****************************************************************************/

// Grab search input and button elements
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

// Function to filter games based on search query
function searchGame() {
    deleteChildElements(gamesContainer);
    
    const searchTerm = searchInput.value.toLowerCase();
    const filteredGames = GAMES_JSON.filter(game =>
        game.name.toLowerCase().includes(searchTerm)
    );

    addGamesToPage(filteredGames);
}

// Add event listener to the search button
searchBtn.addEventListener("click", searchGame);

/*****************************************************************************
 * Custom Feature 2: Smooth Scroll to "Our Games"
 *****************************************************************************/

// Grab the scroll button element
const scrollBtn = document.getElementById("scroll-to-games");

// Scroll to the games section when clicked
scrollBtn.addEventListener("click", () => {
    document.getElementById("games-container").scrollIntoView({ behavior: "smooth" });
});
