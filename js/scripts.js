const players = []; // Array where created players are stored in.
const playerspw = [];
const selectPlayers = document.getElementById('player-count');
const divPlayers = document.getElementById('players');
const divLetterList = document.getElementById('letterlist');
const divPlayerTurn = document.getElementById('playerturn');
const divSpelRegels = document.getElementById('spelregels')
const btnStart = document.getElementById('btnStart');
const btnPlaats = document.querySelector('#btnPlaatsen');
const mainSection = document.querySelector('main');
const btnReplace = document.querySelector('#btnReplace');
const btnSpelRegels = document.querySelector('#btnSpelregels');
const btnEinde = document.querySelector('#btnEinde');
let eersteletterbool = true;
let numPlayers = 2;
let scoreLijst = [{}, {}];
let playerLetters = [{}, {}];
let playerScores = [];
let currentPlayerIndex = 0;
let SelectedLetter;
let ValidCoords = [];
let selectedTile;
let currentPlayerLetters;
let letTiles;
let eersteletter;
let CurrentLang;
let PlayedTiles = [];
let PlayedCells = [];

// Waarden van de letters bij de Nederlandse versie 
const letterTilesNL = [
    { letter: "A", value: 1, frequency: 6 },
    { letter: "E", value: 1, frequency: 13 },
    { letter: "N", value: 1, frequency: 10 },
    { letter: "I", value: 1, frequency: 6 },
    { letter: "O", value: 1, frequency: 6 },
    { letter: "R", value: 1, frequency: 6 },
    { letter: "T", value: 1, frequency: 6 },
    { letter: "D", value: 1, frequency: 5 },
    { letter: "G", value: 2, frequency: 4 },
    { letter: "H", value: 2, frequency: 3 },
    { letter: "L", value: 2, frequency: 3 },
    { letter: "S", value: 1, frequency: 3 },
    { letter: "B", value: 3, frequency: 2 },
    { letter: "C", value: 3, frequency: 2 },
    { letter: "M", value: 3, frequency: 2 },
    { letter: "P", value: 3, frequency: 2 },
    { letter: "J", value: 4, frequency: 2 },
    { letter: "K", value: 4, frequency: 2 },
    { letter: "U", value: 4, frequency: 2 },
    { letter: "V", value: 4, frequency: 2 },
    { letter: "W", value: 4, frequency: 2 },
    { letter: "F", value: 5, frequency: 1 },
    { letter: "Z", value: 6, frequency: 2 },
    { letter: "X", value: 8, frequency: 1 },
    { letter: "Y", value: 8, frequency: 1 },
    { letter: "Q", value: 10, frequency: 1 },
    { letter: "_", value: 0, frequency: 7 } // BLANK TILES

];

// Waarden van de letters bij de Franse versie
const letterTilesFR = [
    { letter: "A", value: 1, frequency: 9 },
    { letter: "E", value: 1, frequency: 15 },
    { letter: "N", value: 1, frequency: 6 },
    { letter: "I", value: 1, frequency: 8 },
    { letter: "O", value: 1, frequency: 6 },
    { letter: "R", value: 1, frequency: 6 },
    { letter: "T", value: 1, frequency: 6 },
    { letter: "S", value: 1, frequency: 6 },
    { letter: "U", value: 1, frequency: 6 },
    { letter: "L", value: 1, frequency: 5 },
    { letter: "D", value: 2, frequency: 3 },
    { letter: "G", value: 2, frequency: 2 },
    { letter: "M", value: 2, frequency: 3 },
    { letter: "B", value: 3, frequency: 2 },
    { letter: "C", value: 3, frequency: 2 },
    { letter: "P", value: 3, frequency: 2 },
    { letter: "F", value: 4, frequency: 2 },
    { letter: "H", value: 4, frequency: 2 },
    { letter: "V", value: 4, frequency: 2 },
    { letter: "J", value: 8, frequency: 1 },
    { letter: "Q", value: 8, frequency: 1 },
    { letter: "K", value: 10, frequency: 1 },
    { letter: "W", value: 10, frequency: 1 },
    { letter: "X", value: 10, frequency: 1 },
    { letter: "Y", value: 10, frequency: 1 },
    { letter: "Z", value: 10, frequency: 1 },
    { letter: "_", value: 0, frequency: 2 } // BLANK TILES
];

function distributeLetterTilesToPlayer(letterTiles, index) {
    const playerTiles = [];
    for (let i = 0; i < index; i++) {
      // Maak array met tiles waarvan frequency > 0
      const availableTiles = letterTiles.filter(tile => tile.frequency > 0);
      if (availableTiles.length === 0) {
        console.log("Geen tiles meer beschikbaar.");
        break;
      }
      const randomIndex = Math.floor(Math.random() * availableTiles.length);
      const selectedTile = availableTiles[randomIndex];
      playerTiles.push(selectedTile);
      selectedTile.frequency--;
    }
    return playerTiles;
}

function StartGame(lang) { // Starts the game with the selected language value and number of players.
    playerLetters = [],[]; // Reset player letters array
    updatePlayerTurn(currentPlayerIndex); // Instantly makes the divs to store information of the first player on game start.

        if (lang == 'NL') {
            letTiles = letterTilesNL;
            CurrentLang = 'NL';

        } else if (lang == 'FR') {
            letTiles = letterTilesFR;
            CurrentLang = 'FR';
        }
        playerLetters[0] = distributeLetterTilesToPlayer(letTiles, 7);
        playerLetters[1] = distributeLetterTilesToPlayer(letTiles, 7);
        playerLetters[2] = distributeLetterTilesToPlayer(letTiles, 7);
        playerLetters[3] = distributeLetterTilesToPlayer(letTiles, 7);

}
function handleTileClick(event) {
    // Geef de waarden van de tile waarop je klikt door aan de selectedTile variabele
    selectedTile = event.target;
}
function handleReplace(event) {
    const cell = event.target;
    if (selectedTile) {
        currentPlayerLetters.splice(selectedTile.value, 1);
        selectedTile.style.display = 'none'; // Hide selected tile
        selectedTile = null;
        switchPlayerTurn();
      }
}
function handleCellClick(event) {
    const cell = event.target;
    // Als selectedTile waarde heeft...
    if (selectedTile) {
        PlayedTiles.push(selectedTile.innerHTML);
        PlayedCells.push(cell);

        cell.removeEventListener('click', handleCellClick);
        currentPlayerLetters.splice(selectedTile.value, 1);
        cell.innerText = selectedTile.innerText;
        

        if (eersteletterbool) {
            eersteletter = cell;
            eersteletterbool = false;
        }
        if (cell.id.charAt(0) != 'A') {
           getAdjacentCoordinates(cell.id).forEach(item => {
            const cel = document.querySelector(`#${item}`);
            
            if (ValidCoords.includes(item)) {
                cel.removeEventListener('click', handleCellClick);
            } else {
                cel.addEventListener('click', handleCellClick);
                ValidCoords.push(item);
                
            }
        }); 
        }
        

        selectedTile.style.display = 'none'; // Hide selected tile
        selectedTile = null;
      // Update de staat van de game en check of het woord juist is
      // andere functies ...
    }
}


function scrabbleScore() {
    let newAlphabet = {};
    if (CurrentLang == 'NL') {
        newAlphabet = { A: 1, E: 1, N: 1, I: 1, O: 1, R: 1, T: 1, D: 1, G: 2, H: 2, L: 2, S: 1, B: 3, C: 3, M: 3, P: 3, J: 4, K: 4, U: 4, V: 4, W: 4, F: 5, Z: 6, X: 8, Y: 8, Q: 10 };
    } else if (CurrentLang == 'FR') {
        newAlphabet = { A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 10, L: 1, M: 2, N: 1, O: 1, P: 3, Q: 8, R: 1, S: 1, T: 1, U: 1, V: 4, W: 10, X: 10, Y: 10, Z: 10 };
    }       
    sum = 0;
    for (let i = 0; i < PlayedTiles.length; i++) {
          
        if (PlayedCells[i].className == 'cell2') {
                sum += 2*(newAlphabet[PlayedTiles[i]] || 0); // for unknown characters
            } else if (PlayedCells[i].className == 'cell3') {
                sum += 3*(newAlphabet[PlayedTiles[i]] || 0); // for unknown characters
            } else {
                sum += newAlphabet[PlayedTiles[i]] || 0; // for unknown characters
            }
        
    }
    
        return sum;
    }


function createPlayerElements(playerNumber) { // Creates a new input box to put in player names.
    while (divPlayers.children.length > 0) {
        divPlayers.removeChild(divPlayers.children[0]);
    }
    for (let index = 1; index <= playerNumber; index++) {
        lblPlayer = document.createElement('label');
        lblPlayer.setAttribute('for', `player${index}`);
        lblPlayer.setAttribute('id', `player${index}label`);
        lblPlayer.textContent = `Name player ${index}:`;
        divPlayers.appendChild(lblPlayer);

        inpPlayer = document.createElement('input');
        inpPlayer.setAttribute('type', 'text');
        inpPlayer.setAttribute('id', `player${index}`);
        divPlayers.appendChild(inpPlayer);

        lblPwPlayer = document.createElement('label');
        lblPwPlayer.setAttribute('for', `player${index}`);
        lblPwPlayer.setAttribute('id', `player${index}label`);
        lblPwPlayer.textContent = `Password player ${index}:`;
        divPlayers.appendChild(lblPwPlayer);

        inpPwPlayer = document.createElement('input');
        inpPwPlayer.setAttribute('type', 'password');
        inpPwPlayer.setAttribute('id', `player${index}pw`);
        divPlayers.appendChild(inpPwPlayer);
    }

}

function switchPlayerTurn() {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length; // Update the current player index.
    LoadPlayer(currentPlayerIndex);
    updatePlayerTurn(currentPlayerIndex);
}

function LoadPlayer(playerIndex) {
    eersteletterbool = true;
    if (playerLetters[playerIndex].length < 7) {
        distributeLetterTilesToPlayer(letTiles, 7-playerLetters[playerIndex].length).forEach(element => {
            playerLetters[playerIndex].push(element);
        });
    }
    divLetterList.innerHTML = '';

    currentPlayerLetters = playerLetters[playerIndex];
    
    for (let index = 0; index < currentPlayerLetters.length; index++) {
        const a = document.createElement('a');
        a.innerHTML = currentPlayerLetters[index].letter; // Set the letter as text content
        a.value = index;
        a.addEventListener('click', handleTileClick);
        divLetterList.appendChild(a); // Append the <a> element to the div of letterlist.
    }
}

// Function to update the player turn on button click.
function updatePlayerTurn(playerIndex) {
    divPlayerTurn.removeChild(divPlayerTurn.firstChild);
    let playerTurn = document.createElement('p');
    if (playerScores[playerIndex] != undefined) {
        playerTurn.textContent = `Player: ${playerIndex + 1} - ${players[playerIndex].name} - punten: ${playerScores[playerIndex]}`;
    } else {
        playerTurn.textContent = `Player: ${playerIndex + 1} - ${players[playerIndex].name}`;
    }
    
    divPlayerTurn.appendChild(playerTurn);
}

function getAdjacentCoordinates(coord) {
    const file = coord[0];
    const rank = parseInt(coord[1], 10);
    const adjacentCoords = [];

    if (file !== "a") {
        adjacentCoords.push(String.fromCharCode(file.charCodeAt(0) - 1) + rank);
    }

    if (file !== "i") {
        adjacentCoords.push(String.fromCharCode(file.charCodeAt(0) + 1) + rank);
    }

    if (rank !== 1) {
        adjacentCoords.push(file + (rank - 1));
    }

    if (rank !== 8) {
        adjacentCoords.push(file + (rank + 1));
    }
    return adjacentCoords;
}


async function checkTextFile(searchText) {
    
    try {
        let woordlist;
        if (CurrentLang == 'NL') {
            woordlist = 'https://raw.githubusercontent.com/OpenTaal/opentaal-wordlist/master/wordlist.txt';
        } else if (CurrentLang == 'FR') {
            woordlist = 'https://raw.githubusercontent.com/chrplr/openlexicon/master/datasets-info/Liste-de-mots-francais-Gutenberg/liste.de.mots.francais.frgut.txt';
        }
    
        const response = await fetch(woordlist);
        const data = await response.text();
        const words = data.split('\n');

        // chatGPT gebruikt om wildcard te laten werken
        const searchTextRegex = searchText.replace('_', '.'); // Replace '_' with '.'

        const regex = new RegExp(searchTextRegex, 'i'); // 'i' flag makes the search case-insensitive
        return words.some(word => regex.test(word)); // Use 'some' to stop searching once a match is found
    } catch (error) {
        console.error(error);
    }
}
function HorWordCheck() {
    // Horizontal Check

    let horizontalWord = eersteletter.innerHTML;
    let horizontalRepeat = true;
    let horizontalRight = '';
    let horizontalCheckFirstLetter = true;
    let horizontalCell;

    while (horizontalRepeat) {
        if (eersteletter.id.charAt(0) != 'I' && horizontalRight != 'I') {
            if (horizontalCheckFirstLetter) {
                horizontalCell = document.querySelector(`#${getAdjacentCoordinates(eersteletter.id)[1]}`); // Rechter cel.
                horizontalRight = horizontalCell;
                horizontalCheckFirstLetter = false;
            } else {
                horizontalCell = document.querySelector(`#${getAdjacentCoordinates(horizontalRight.id)[1]}`); // Rechter cel.
                horizontalRight = horizontalCell;
            }
            
            if (horizontalCell.innerHTML != '' && horizontalCell.innerHTML != '2x' && horizontalCell.innerHTML != '3x') {
                horizontalWord += horizontalCell.innerHTML;

            } else {
                horizontalRepeat = false;
            }
        }   else {
            horizontalRepeat = false;
        }
    }
    return horizontalWord;
}
function VerWordCheck() {
    // Vertical Check
    let verticalWord = eersteletter.innerHTML;
    let verticalRepeat = true;
    let verticalBelow = '';
    let verticalCheckFirstLetter = true;
    let verticalCell;
    while (verticalRepeat) {
        if (eersteletter.id.charAt(1) != '9' && verticalBelow != '9') {
            if (verticalCheckFirstLetter) {
                verticalCell = document.querySelector(`#${getAdjacentCoordinates(eersteletter.id)[3]}`); // Onderste cel.
                verticalBelow = verticalCell;
                verticalCheckFirstLetter = false;
            } else {
                verticalCell = document.querySelector(`#${getAdjacentCoordinates(verticalBelow.id)[3]}`); // Onderste cel.
                verticalBelow = verticalCell;
            }
            
            if (verticalCell.innerHTML != '' && verticalCell.innerHTML != '2x' && verticalCell.innerHTML != '3x') {
                verticalWord += verticalCell.innerHTML;

            } else {
                verticalRepeat = false;
            }
        }   else {
            verticalRepeat = false;
        }
    }
    return verticalWord;
}
async function checkWord() { 
    let Word = '';
    FindFirstLetter();
    if (eersteletter.id.charAt(0) != 'I') {
        const CellEersteRightLet = document.querySelector(`#${getAdjacentCoordinates(eersteletter.id)[1]}`);
        if (CellEersteRightLet.innerHTML != '') {
            Word = HorWordCheck();
        }
        else{
            Word = VerWordCheck();
        }
    }
    Word = Word.toLowerCase();
    //horizontal word correct or incorrect
    if (await checkTextFile(Word)) {
        if (playerScores[currentPlayerIndex] != null) {
            playerScores[currentPlayerIndex] += scrabbleScore();
        } else{
            playerScores[currentPlayerIndex] = scrabbleScore();
        }
        PlayedCells = [];
        PlayedTiles = [];
        } else {
        console.log('Het woord is incorrect.');
    }
}
function FindFirstLetter() {
    if (eersteletter.id.charAt(0) != 'A' && eersteletter.id.charAt(0) != 'I') {
        const CellEersteRightLet = document.querySelector(`#${getAdjacentCoordinates(eersteletter.id)[1]}`);
        const CellEersteLinksLet = document.querySelector(`#${getAdjacentCoordinates(eersteletter.id)[0]}`);
        
        if (CellEersteLinksLet != '' || CellEersteRightLet != '') {
            const cel = document.querySelector(`#${getAdjacentCoordinates(eersteletter.id)[0]}`); // Linker cel.
            if (cel.innerHTML != '' && cel.innerHTML != '2x' && cel.innerHTML != '3x') {
                eersteletter = cel;
                FindFirstLetter();
            } 
        }
        else {
            const cel = document.querySelector(`#${getAdjacentCoordinates(eersteletter.id)[2]}`); // Boven cel.
            if (cel.innerHTML != '' && cel.innerHTML != '2x' && cel.innerHTML != '3x') {
                eersteletter = cel;
                FindFirstLetter();
            } 
        }
    }

}

// Dropdown menu for the selection of amount of players.
selectPlayers.addEventListener("change", function (e) {
    selectedValue = e.target.value;
    if (selectedValue == 2) {
        numPlayers = 2;
        createPlayerElements(2);
    } else if (selectedValue == 3) {
        numPlayers = 3;
        createPlayerElements(3);
    } else if (selectedValue == 4) {
        numPlayers = 4;
        createPlayerElements(4);
    }
});

// Start button
btnStart.addEventListener('click', function () {
    const login = document.querySelector('#login');
    const Spelbord = document.querySelector('#Spelbord');
    const Lang = document.querySelector('#language');
    const cellSter = document.querySelector('.cellStar');

    


    // Loop through the number of selected players and retrieve player names and store them into the array.
    for (let i = 1; i <= selectPlayers.value; i++) {
        const playerName = document.querySelector(`#player${i}`).value;
        if (playerName.trim() === '') {
            window.alert(`Player ${i} name cannot be blank!`);
            return;
        }
        players.push({ name: playerName }); // Add player names and letters.

        const playerPw = document.querySelector(`#player${i}pw`).value;
        if (playerPw.trim() === '') {
            window.alert(`Player ${i} password cannot be blank!`);
            return;
        }
        playerspw.push({pw: playerPw});
    }

    StartGame(Lang.value);
    LoadPlayer(currentPlayerIndex);


    const btns = document.querySelectorAll('.btn');
    btns.forEach(btn => {
        btn.classList.remove('hide');
        btn.classList.add('btn-show');
    });
    login.classList.add('hide');
    Spelbord.style.display = "block";
    playerturn.style.display = "block";
    btnEinde.style.display = "block";
    cellSter.innerHTML = distributeLetterTilesToPlayer(letTiles, 1)[0].letter;
    getAdjacentCoordinates(cellSter.id).forEach(item => {
        const cel = document.querySelector(`#${item}`);
        cel.addEventListener('click', handleCellClick);
    });

});

// Tabel aanmaking hier
document.addEventListener('DOMContentLoaded', function () {
    // Create table element
    var table = document.createElement('table');
    table.id = 'Spelbord';

    // Define table data as 2D array
    var tableData = [
        ['3x', '', '', '', '3x', '', '', '', '3x'],
        ['', '2x', '', '', '', '', '', '2x', ''],
        ['', '', '3x', '', '', '', '3x', '', ''],
        ['', '', '', '2x', '', '2x', '', '', ''],
        ['3x', '', '', '', '*', '', '', '', '3x'],
        ['', '', '', '2x', '', '2x', '', '', ''],
        ['', '', '3x', '', '', '', '3x', '', ''],
        ['', '2x', '', '', '', '', '', '2x', ''],
        ['3x', '', '', '', '3x', '', '', '', '3x']
    ];

    // Loop through table data and create table rows and cells
    for (var i = 0; i < tableData.length; i++) {
        var row = document.createElement('tr');
        for (var j = 0; j < tableData[i].length; j++) {
            const cell = document.createElement('td');
            if (tableData[i][j] == '2x') {
                cell.className = 'cell2';
            } else if (tableData[i][j] == '3x') {
                cell.className = 'cell3';
            } else if (tableData[i][j] == '*') {
                cell.className = 'cellStar';
            }
            else {
                cell.className = 'cell';
            }

            cell.id = String.fromCharCode(65 + j) + (i + 1);
            
            cell.innerHTML = tableData[i][j];
            
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    // Append table to the main section.
    mainSection.appendChild(table);
    table.style.display = "none";
});
btnPlaats.addEventListener('click', async function () {
    await checkWord();
    switchPlayerTurn();
});

//tonen spelregels bij klikken button
btnSpelRegels.addEventListener('click', function() {
    if (divSpelRegels.classList.contains('hide')) {
        divSpelRegels.classList.remove('hide');
        btnSpelRegels.classList.add('activeBtn');
    } else {
        divSpelRegels.classList.add('hide');
        btnSpelRegels.classList.remove('activeBtn');
    }
});

btnReplace.addEventListener('click', handleReplace);
btnEinde.addEventListener('click', function() {
    let n = playerScores.length;
    let arr = playerScores;
    let swapped;
    do {
        swapped = false;
        for (var i = 0; i < n - 1; i++) {
            if (arr[i] < arr[i + 1]) {
                var temp = arr[i];
                let tempPlayer = players[i];
                let tempPw = playerspw[i];

                arr[i] = arr[i + 1];
                players[i] = players[i+1]
                playerspw = [i+1];

                arr[i + 1] = temp;
                tempPlayer[i+1] = tempPlayer;
                tempPw[i+1] = tempPw;

                swapped = true;
            }
        }
    n--;
  } while (swapped);
    
  window.alert(`${players[0].name} heeft gewonnen, met ${playerScores[0]} punten`);
});

