const wrapperDOM = document.getElementById('wrapper');
let boardDOM;
function initBoard() {
    document.querySelector('#board')?.remove()
    boardDOM = document.createElement('div')
    boardDOM.setAttribute('id', 'board')
    wrapperDOM.appendChild(boardDOM)
};

const playerFactory = (name, mark, isHuman) => {
    let svgMark = `<svg style="width:48px;height:48px" viewBox="0 0 24 24">
    <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
</svg>`
    if (mark == 'o') {
        svgMark = `<svg style="width:36px;height:36px" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
    </svg>`
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
        if (result || arr[4] !== mark) return result
        if (arr[0] == mark && arr[8] == mark) {
            result = true
        } else if (arr[2] == mark && arr[6] == mark) {
            result = true
        };
        if (mark == 'tie' && !arr.includes('')) return true
        return result;
    };

    const cellEventHandler = (cell) => {
        cell = cell.target
        const index = +cell.getAttribute('index');
        displayController.setMark(index, currentPlayerObj.svgMark);
        game.boardArray[index] = currentPlayerObj.mark;

        const results = ['x', 'o', 'tie']
        let result = ''
        for (let i in results) {
            if (doesMarkWin(results[i])) result = results[i]
        }
        if (result !== '') game.endGame(result)
        
        currentPlayerObj = (currentPlayerObj == playerOne) ? playerTwo : playerOne;
        if (!currentPlayerObj.isHuman) {
            computer.makeMove()
        }
    }

    const endGame = (w) => {
        Array.from(document.querySelectorAll('#board > *')).forEach(cell => {
            cell.removeEventListener('click', game.cellEventHandler);
        })
        let msg
        switch (w) {
            case 'x':
                msg = `Player P1 wins!`;
                break;
            case 'o':
                msg = `Player P2 wins!`;
                break;
            default:
                msg = "It's a tie";
        };
        displayController.endGame(msg);
    }
;
    return {
        boardArray,
        cellEventHandler,
        getCurrentPlayerObj,
        initVars,
        endGame
    };
})();



const displayController = (() => {
    const clear = () => {
        game.boardArray = ['', '', '', '', '', '', '', '', ''];
        initGrid();
    };

    
    const initGrid = () => {
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

            cell.addEventListener('click', game.cellEventHandler);
        };

        
    };

    const setMark = (ind, mark) => {
        document.querySelector(`div[index='${ind}']`).innerHTML = mark;
    };


    const endGame = (w) => {
        const endWrapper = document.createElement('div')
        endWrapper.classList.add('end-wrapper')
        document.querySelector('#wrapper').insertBefore(endWrapper, document.querySelector('#board'))

        const endTitle = document.createElement('h1')
        endTitle.textContent = w
        endTitle.classList.add('win-title')
        endWrapper.appendChild(endTitle)

        const newGameBtn = document.createElement('button')
        newGameBtn.textContent = 'Play again'
        newGameBtn.classList.add('end-game-button')
        document.querySelector('#wrapper').appendChild(newGameBtn)

        newGameBtn.addEventListener('click', e => {
            gameMenu.handleMenu()
            endWrapper.remove()
            newGameBtn.remove()
        })
    }

    return {
        clear,
        setMark,
        endGame
    };
})();

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
        displayController.clear();
    }

    return {
        handleMenu,
        newGame
    }
})();

const computer = (() => {
    const randomCell = (arr) => {
        let out = Math.floor(Math.random() * arr.length)
        while (arr[out] !== '') {
            out = Math.floor(Math.random() * arr.length)
        }
        game.cellEventHandler({target: document.querySelector(`.card[index="${out}"]`)})
        return out
    }

    const removeDuplicates = (arr) => {
        return arr
    }

    let moves = []

    const makeMove = () => {
        if (!game.boardArray.includes('o')) {
            moves.push(randomCell(game.boardArray))
            return
        }
        if (moves.length == 1) {
            let options = [moves[0]]
            switch (options[0]) {
                case 2:
                    options.push(options[0] - 1)
                    options.push(options[0] - 2)
                case 1:
                case 0:
                    options.push(options[0] + 3)
                    options.push(options[0] + 6)
                    break
                case 5:
                    options.push(options[0] - 1)
                    options.push(options[0] - 2)
                    case 4:
                case 3:
                    options.push(options[0] - 3)
                    options.push(options[0] + 3)
                    break
                case 8:
                    options.push(options[0] - 1)
                    options.push(options[0] - 2)
                case 7:
                case 6:
                    options.push(options[0] - 3)
                    options.push(options[0] - 6)
                    break
                default:
                    console.log('Error')
            }
            // moves.push(randomCell())
        }
    }

    return {
        makeMove,
        randomCell
    }
})()

gameMenu.handleMenu()
