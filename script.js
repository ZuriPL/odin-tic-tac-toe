const boardDOM = document.getElementById('board')

const playerFactory = (name, mark) => {
    return {
        name,
        mark,
    }
}

playerOne = playerFactory('P1', 'x')
playerTwo = playerFactory('P2', 'o')

const game = (() => {
    let boardArray = ['', '', '', '', '', '', '', '', '']
    let currentPlayerObj = playerOne

    const getCurrentPlayerObj = () => {
        return currentPlayerObj
    }

    const doesMarkWin = (mark) => {
        let result = false
        arr = game.boardArray
        for (let i = 0; i < 3; i++) {
            if (arr[i] == mark && arr[i + 3] == mark && arr[i + 6] == mark) {
                result = true
            } else if (arr[i * 3] == mark && arr[i * 3 + 1] == mark && arr[i * 3 + 2] == mark) {
                result = true
            }
        }
        if (!result && arr[4] == mark) {
            if (arr[0] == mark && arr[8] == mark) {
                result = true
            } else if (arr[2] == mark && arr[6] == mark) {
                result = true
            }
        }
        return result
    }

    const cellEventHandler = (cell) => {
        const index = +cell.getAttribute('index')
        displayController.setMark(index, currentPlayerObj.mark)
        boardArray[index] = currentPlayerObj.mark
        doesMarkWin(currentPlayerObj.mark)
        
        currentPlayerObj = (currentPlayerObj == playerOne) ? playerTwo : playerOne
    }
    return {
        boardArray,
        cellEventHandler,
        getCurrentPlayerObj,
        // doesMarkWin
    }
})();



const displayController = (() => {
    const clear = () => {
        game.boardArray = ['', '', '', '', '', '', '', '', '']
        initGrid()
    }

    

    const initGrid = () => {
        Array.from(boardDOM.children).forEach(e => {
            e.remove()
        })

        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('card');
            cell.textContent = game.boardArray[i];
            cell.setAttribute('index', i)
            
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
            })
        };
    };

    const setMark = (ind, mark) => {
        document.querySelector(`div[index='${ind}']`).innerHTML = mark
    }

    return {
        clear,
        initGrid,
        setMark
    }
})();




function doesMarkWin(mark) {
    let result = false
    arr = game.boardArray
    for (let i = 0; i < 3; i++) {
        if (arr[i] == mark && arr[i + 3] == mark && arr[i + 6] == mark) {
            result = true
        } else if (arr[i * 3] == mark && arr[i * 3 + 1] == mark && arr[i * 3 + 2] == mark) {
            result = true
        }
    }
    if (!result && arr[4] == mark) {
        if (arr[0] == mark && arr[8] == mark) {
            result = true
        } else if (arr[2] == mark && arr[6] == mark) {
            result = true
        }
    }
    return result
}



displayController.initGrid()

