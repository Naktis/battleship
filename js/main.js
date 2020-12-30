document.addEventListener('DOMContentLoaded', () => {
  const userGrid = document.querySelector('.grid-user');
  const computerGrid = document.querySelector('.grid-computer');
  const displayGrid = document.querySelector('.grid-display');
  const ships = document.querySelectorAll('.ship');
  // todo: ships?
  const startButton = document.querySelectorAll('#start-game-button');
  const rotateButton = document.querySelectorAll('#rotate-ships');
  const turnDisplay = document.querySelectorAll('#turn');
  const resultDisplay = document.querySelectorAll('#result');
  const squareWidth = 10;
  let userBoard = Array(11).fill(0).map(() => Array(11).fill(0));
  let computerBoard = Array(11).fill(0).map(() => Array(11).fill(0));

  // create a board
  function createBoard(grid, board) {
    const emptyDiv = document.createElement('div');
    grid.appendChild(emptyDiv);

    for (let i = 65; i <= 74; i ++) {
      const letterDiv = document.createElement('div');
      const letterText = document.createTextNode(String.fromCharCode(i));
      letterDiv.appendChild(letterText);
      grid.appendChild(letterDiv);
    }

    for (let row = 1; row <= 10; row ++) {
      const numberDiv = document.createElement('div');
      const numberText = document.createTextNode(row);
      numberDiv.appendChild(numberText);
      grid.appendChild(numberDiv);

      for (let column = 1; column <= 10; column ++) {
        const square = document.createElement('div');
        square.dataset.id = [row, column];
        grid.appendChild(square);
      }
    }
  }

  createBoard(userGrid, userBoard);
  createBoard(computerGrid, computerBoard);
})