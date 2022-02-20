const board = document.getElementById('board');

const displayController = (() => {
    const markX = `<svg style="width:24px;height:24px" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                    </svg>`
    const markO = `<svg style="width:24px;height:24px" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                    </svg>`

    const render = () => {
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('card');
            cell.textContent = game.getGameboard()[Math.floor(i / 3) % 3][i % 3];
            
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
            
            board.appendChild(cell);
        };
    };

    return {
        render,
    };
})();

const game = (() => {
    let gameboard = [['', '', ''], 
                     ['', '', ''], 
                     ['', '', '']];

    const checkWin = () => {
        for (let i = 0; i < 9; i++) {}
    }


    const getGameboard = () => {
        return gameboard
    }

    

    const startGame = () => {
        displayController.render()
    }

    return {
        startGame,
        getGameboard
    }
})();

game.startGame()

