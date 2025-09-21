document.addEventListener('DOMContentLoaded', function() {
    // Configuración del juego
    const boardSize = 3;
    let board = [];
    let emptyCell = boardSize * boardSize - 1;
    let gameStarted = false;
    
    // Elementos del DOM
    const puzzleBoard = document.getElementById('puzzle-board');
    const startButton = document.getElementById('start-btn');
    const shuffleButton = document.getElementById('shuffle-btn');
    const modal = document.getElementById('message-modal');
    const closeBtn = document.getElementById('close-btn');
    
    // Imagen romántica
    const imageUrl = "images/sunflowers.png";
    
    // Inicializar el tablero
    function initializeBoard() {
        puzzleBoard.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
        
        // Crear el tablero con números ordenados (1-8)
        for (let i = 1; i < boardSize * boardSize; i++) {
            board.push(i);
        }
        board.push(null); // Celda vacía (posición 9)
        emptyCell = boardSize * boardSize - 1;
        
        renderBoard();
    }
    
    // Renderizar el tablero
    function renderBoard() {
        puzzleBoard.innerHTML = '';
        
        for (let i = 0; i < board.length; i++) {
            const cellValue = board[i];
            const cell = document.createElement('div');
            
            if (cellValue === null) {
                cell.className = 'puzzle-piece empty';
                cell.innerHTML = ''; // Asegurar que esté vacío
            } else {
                cell.className = 'puzzle-piece';
                
                // Establecer la imagen de fondo para cada pieza
                const row = Math.floor((cellValue - 1) / boardSize);
                const col = (cellValue - 1) % boardSize;
                
                // Corregir el cálculo de la posición de fondo
                const backgroundPosX = (col * 100) / (boardSize - 1);
                const backgroundPosY = (row * 100) / (boardSize - 1);
                
                cell.style.backgroundImage = `url(${imageUrl})`;
                cell.style.backgroundPosition = `${backgroundPosX}% ${backgroundPosY}%`;
                cell.style.backgroundSize = `${boardSize * 100}%`;
                
                // Añadir evento de clic
                cell.addEventListener('click', () => moveCell(i));
            }
            
            puzzleBoard.appendChild(cell);
        }
        
        updateMovableCells();
    }
    
    // Actualizar celdas movibles
    function updateMovableCells() {
        const cells = puzzleBoard.querySelectorAll('.puzzle-piece:not(.empty)');
        
        cells.forEach(cell => {
            cell.classList.remove('movable');
        });
        
        // Comprobar celdas adyacentes a la celda vacía
        const adjacentIndexes = getAdjacentIndexes(emptyCell);
        
        adjacentIndexes.forEach(index => {
            if (index >= 0 && index < boardSize * boardSize) {
                const cell = puzzleBoard.children[index];
                if (cell && !cell.classList.contains('empty')) {
                    cell.classList.add('movable');
                }
            }
        });
    }
    
    // Obtener índices adyacentes
    function getAdjacentIndexes(index) {
        const row = Math.floor(index / boardSize);
        const col = index % boardSize;
        
        const adjacentIndexes = [];
        
        // Arriba
        if (row > 0) adjacentIndexes.push(index - boardSize);
        // Abajo
        if (row < boardSize - 1) adjacentIndexes.push(index + boardSize);
        // Izquierda
        if (col > 0) adjacentIndexes.push(index - 1);
        // Derecha
        if (col < boardSize - 1) adjacentIndexes.push(index + 1);
        
        return adjacentIndexes;
    }
    
    // Mover celda
    function moveCell(index) {
        if (!gameStarted) return;
        
        const adjacentIndexes = getAdjacentIndexes(index);
        
        if (adjacentIndexes.includes(emptyCell)) {
            // Intercambiar la celda con la celda vacía
            [board[index], board[emptyCell]] = [board[emptyCell], board[index]];
            emptyCell = index;
            
            renderBoard();
            
            // Comprobar si el juego está completo
            if (isGameComplete()) {
                console.log("¡Rompecabezas completado!");
                showMessage();
            }
        }
    }
    
    // Barajar el tablero
    function shuffleBoard() {
        // Realizar movimientos aleatorios para barajar
        for (let i = 0; i < 200; i++) {
            const adjacentIndexes = getAdjacentIndexes(emptyCell);
            const randomIndex = Math.floor(Math.random() * adjacentIndexes.length);
            const randomCell = adjacentIndexes[randomIndex];
            
            [board[randomCell], board[emptyCell]] = [board[emptyCell], board[randomCell]];
            emptyCell = randomCell;
        }
        
        renderBoard();
    }
    
    // Comenzar juego
    function startGame() {
        gameStarted = true;
        startButton.disabled = true;
        shuffleButton.disabled = false;
        shuffleBoard();
    }
    
    // Comprobar si el juego está completo
    function isGameComplete() {
        for (let i = 0; i < board.length - 1; i++) {
            if (board[i] !== i + 1) {
                return false;
            }
        }
        return true;
    }
    
    // Mostrar mensaje
    function showMessage() {
        modal.style.display = 'flex';
    }
    
    // Cerrar mensaje y reiniciar juego
    function closeMessage() {
        modal.style.display = 'none';
        resetGame();
    }
    
    // Reiniciar juego
    function resetGame() {
        gameStarted = false;
        startButton.disabled = false;
        shuffleButton.disabled = true;
        
        // Reiniciar el tablero
        board = [];
        for (let i = 1; i < boardSize * boardSize; i++) {
            board.push(i);
        }
        board.push(null);
        emptyCell = boardSize * boardSize - 1;
        
        renderBoard();
    }
    
    // Event listeners
    startButton.addEventListener('click', startGame);
    shuffleButton.addEventListener('click', shuffleBoard);
    closeBtn.addEventListener('click', closeMessage);
    
    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeMessage();
        }
    });
    
    // Inicializar el juego
    initializeBoard();
})