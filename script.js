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
        game.boardArray = ['', '', '', '', '', '', '', '', ''];
    }

    const getCurrentPlayerObj = () => {
        return currentPlayerObj;
    };

    const doesMarkWin = (mark) => {
        let result = false;
        const arr = game.boardArray;
        
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
        if (mark == 'tie' && !!!game.boardArray.includes('')) result =  true
        return result;
    };

    const cellEventHandler = (cell) => {
        cell = cell.target

        if (cell.textContent !== '') return 

        const index = +cell.getAttribute('index');
        displayController.setMark(index, currentPlayerObj.svgMark);
        game.boardArray[index] = currentPlayerObj.mark;

        const results = ['x', 'o', 'tie']
        let result = ''
        for (let i in results) {
            if (doesMarkWin(results[i])) result = results[i]
        }
        if (result !== '') {
            game.endGame(result)
            return
        }
        
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
        endGame,
        doesMarkWin
    };
})();



const displayController = (() => {
    const clear = () => {
        game.initVars()
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
    let moves = []

    const chooseRandomCell = (arr) => {
        let out = arr.sort((a, b) => 0.5 - Math.random())[0]
        while (game.boardArray[out] !== '') {
            out = arr.sort((a, b) => 0.5 - Math.random())[0]
        }
        game.cellEventHandler({target: document.querySelector(`.card[index="${out}"]`)})
        return out
    }

    const getLegalMoves = (arr = [0, 1, 2, 3, 4, 5, 6, 7, 8]) => {
        let legalMoves = []
        arr.forEach(x => {
            if (game.boardArray[x] === '') {
                legalMoves.push(x)
            }
        })
        return legalMoves
    }

    const makeSmartMove = (i) => {
        let options = []
        switch (moves[i]) {
            case 0:
                options = options.concat([1, 2, 3, 6, 4, 8])
                break
            case 1:
                options = options.concat([0, 2, 4, 7])
                break
            case 2:
                options = options.concat([0, 1, 5, 8, 4, 6])
                break
            case 3:
                options = options.concat([0, 6, 4, 5])
                break
            case 4:
                options = options.concat([0, 1, 2, 3, 5, 6, 7, 8])
                break
            case 5:
                options = options.concat([2, 8, 4, 3])
                break
            case 6:
                options = options.concat([0, 3, 7, 8, 4, 2])
                break
            case 7:
                options = options.concat([6, 8, 4, 1])
                break
            case 8:
                options = options.concat([0, 4, 6, 7, 2, 5])
                break
            default:
                console.log('Error')
        };
        return options
    };

    const isWinnableForMark = (mark) => {
        let result = false
        if ((game.boardArray[2] == mark && game.boardArray[1] == mark) || (game.boardArray[3] == mark && game.boardArray[6] == mark) || (game.boardArray[4] == mark && game.boardArray[8] == mark)) {
            if (game.boardArray[0] === '') { result = 0 }
        } else if ((game.boardArray[0] == mark && game.boardArray[2] == mark) || (game.boardArray[4] == mark && game.boardArray[7] == mark)) {
            if (game.boardArray[1] === '') { result = 1 }
        } else if ((game.boardArray[0] == mark && game.boardArray[1] == mark) || (game.boardArray[5] == mark && game.boardArray[8] == mark) || (game.boardArray[4] == mark && game.boardArray[6] == mark)) {
            if (game.boardArray[2] === '') { result = 2 }
        } else if ((game.boardArray[0] == mark && game.boardArray[6] == mark) || (game.boardArray[4] == mark && game.boardArray[5] == mark)) {
            if (game.boardArray[3] === '') { result = 3 }
        } else if ((game.boardArray[3] == mark && game.boardArray[5] == mark) || (game.boardArray[1] == mark && game.boardArray[7] == mark ) || (game.boardArray[0] == mark && game.boardArray[8] == mark ) || (game.boardArray[6] == mark && game.boardArray[2] == mark )) {
            if (game.boardArray[4] === '') { result = 4 }
        } else if ((game.boardArray[3] == mark && game.boardArray[4] == mark) || (game.boardArray[2] == mark && game.boardArray[8] == mark )) {
            if (game.boardArray[5] === '') { result = 5 }
        } else if ((game.boardArray[0] == mark && game.boardArray[3] == mark) || (game.boardArray[7] == mark && game.boardArray[8] == mark ) || (game.boardArray[4] == mark && game.boardArray[2] == mark )) {
            if (game.boardArray[6] === '') { result = 6 }
        } else if ((game.boardArray[6] == mark && game.boardArray[8] == mark) || (game.boardArray[1] == mark && game.boardArray[4] == mark )) {
            if (game.boardArray[7] === '') { result = 7 }
        } else if ((game.boardArray[2] == mark && game.boardArray[5] == mark) || (game.boardArray[6] == mark && game.boardArray[7] == mark ) || (game.boardArray[0] == mark && game.boardArray[4] == mark )) {
            if (game.boardArray[8] === '') { result = 8 }
        }

        return result
    }

    const isWinnable = () => {
        return isWinnableForMark('o')
    }
    
    const isLosable = () => {
        return isWinnableForMark('x')
    }

    const makeMove = () => {
        let winMove = isWinnable()
        let loseMove = isLosable()
        if (winMove !== false) {
            console.log('win')
            chooseRandomCell(getLegalMoves([winMove]))
        } else if (loseMove !== false) {
            console.log('phew')
            chooseRandomCell(getLegalMoves([loseMove]))
        } else if (moves.length == 0) {
            moves.push(chooseRandomCell(getLegalMoves()))
        } else if (moves.length == 1) {
            makeSmartMove(0)
            moves.push(chooseRandomCell(getLegalMoves(makeSmartMove(0))))
        } else {
            let options = []
            moves.forEach(x => {
                options = options.concat(getLegalMoves(makeSmartMove(moves.indexOf(x))))
            })
            // removes duplicates
            options = [...new Set(options)]
            moves.push(chooseRandomCell(getLegalMoves(options)))
        }
    }

    return {
        makeMove,
        getLegalMoves,
        chooseRandomCell,
        isWinnableForMark
    }
})()

gameMenu.handleMenu()
