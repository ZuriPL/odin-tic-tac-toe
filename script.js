const wrapperDOM = document.getElementById('wrapper');
let boardDOM;
function initBoard() {
    document.querySelector('#board')?.remove()
    boardDOM = document.createElement('div')
    boardDOM.setAttribute('id', 'board')
    wrapperDOM.appendChild(boardDOM)
};

const playerFactory = (name, mark, isHuman) => {
    let svgMark = `x`
    if (mark == 'o') {
        svgMark = `o`
    }
    return {
        name,
        mark,
        isHuman,
        svgMark,
    };
};

let playerOne
let playerTwo

const game = (() => {
    let boardArray = ['', '', '', '', '', '', '', '', ''];
    let currentPlayerObj;

    const initVars = () => {
        currentPlayerObj = playerOne;
        boardArray = ['', '', '', '', '', '', '', '', ''];
    }

    const getCurrentPlayerObj = () => {
        return currentPlayerObj;
    };

    const doesMarkWin = (mark) => {
        let result = false;
        const arr = boardArray;

        // yes, there's a lot of magic numbers in here and I hate it
        for (let i = 0; i < 3; i++) {
            if (arr[i] == mark && arr[i + 3] == mark && arr[i + 6] == mark) {
                result = true
            } else if (arr[i * 3] == mark && arr[i * 3 + 1] == mark && arr[i * 3 + 2] == mark) {
                result = true
            };
        };
        if (!result && arr[4] == mark) {
            if (arr[0] == mark && arr[8] == mark) {
                result = true
            } else if (arr[2] == mark && arr[6] == mark) {
                result = true
            };
        };
        return result;
    };

    const cellEventHandler = (cell) => {
        const index = +cell.getAttribute('index');
        displayController.setMark(index, currentPlayerObj.svgMark);
        boardArray[index] = currentPlayerObj.mark;
        if (doesMarkWin(currentPlayerObj.mark)) {
            console.log(currentPlayerObj.name)
        }
        
        currentPlayerObj = (currentPlayerObj == playerOne) ? playerTwo : playerOne;
    }
    return {
        boardArray,
        cellEventHandler,
        getCurrentPlayerObj,
        initVars
    };
})();



const displayController = (() => {
    const clear = () => {
        game.boardArray = ['', '', '', '', '', '', '', '', ''];
        initGrid();
    };

    
    const initGrid = () => {
        // Array.from(boardDOM.children).forEach(e => {
        //     e.remove()
        // })

        initBoard();

        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('card');
            cell.textContent = game.boardArray[i];
            cell.setAttribute('index', i);
            
            // the if block is only here so I can collapse it in VSCode
            if (true) {
                if (i < 3) {
                    cell.classList.add('grid-top-edge');
                } 
                if (i >= 3 * 3 - 3) {
                    cell.classList.add('grid-bottom-edge');
                } 
                if (i % 3 == 0) {
                    cell.classList.add('grid-left-edge')
                }
                if (i % 3 == 3 - 1) {
                    cell.classList.add('grid-right-edge')
                }
            };
            
            
            boardDOM.appendChild(cell);

            cell.addEventListener('click', e => {
                game.cellEventHandler(cell);
            });
        };

        
    };

    const setMark = (ind, mark) => {
        document.querySelector(`div[index='${ind}']`).innerHTML = mark;
    };

    return {
        clear,
        initGrid,
        setMark
    };
})();




// function doesMarkWin(mark) {
//     let result = false
//     arr = game.boardArray
//     for (let i = 0; i < 3; i++) {
//         if (arr[i] == mark && arr[i + 3] == mark && arr[i + 6] == mark) {
//             result = true
//         } else if (arr[i * 3] == mark && arr[i * 3 + 1] == mark && arr[i * 3 + 2] == mark) {
//             result = true
//         }
//     }
//     if (!result && arr[4] == mark) {
//         if (arr[0] == mark && arr[8] == mark) {
//             result = true
//         } else if (arr[2] == mark && arr[6] == mark) {
//             result = true
//         }
//     }
//     return result
// }

const gameMenu = (() => {

    const handleClick = (e) => {
        newGame(+e.target.getAttribute('mode'));
    }

    const handleMenu = () => {
        document.querySelector('#menu').classList.remove('hidden')
        document.querySelector('#wrapper').classList.add('hidden')
        const buttonOne = document.querySelector('.menu-button[mode="1"]')
        const buttonTwo = document.querySelector('.menu-button[mode="2"]')
        
        buttonOne.removeEventListener('click', handleClick);
        buttonTwo.removeEventListener('click', handleClick);
        buttonOne.addEventListener('click', handleClick);
        buttonTwo.addEventListener('click', handleClick);
    };

    const newGame = (x) => {
        document.querySelector('#menu').classList.add('hidden')
        document.querySelector('#wrapper').classList.remove('hidden')

        if (x == 1) {
            playerOne = playerFactory('P1', 'x', true);
            playerTwo = playerFactory('P2', 'o', false);
        } else {
            playerOne = playerFactory('P1', 'x', true);
            playerTwo = playerFactory('P2', 'o', true);
        }

        game.initVars()
        displayController.initGrid();
    }

    return {
        handleMenu,
        newGame
    }
})();

gameMenu.handleMenu()
