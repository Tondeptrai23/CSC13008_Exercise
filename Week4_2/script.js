// Constants
const BOARD_SIZE = 8;
const PIECE_TYPES = {
    ROOK: "rook",
    KNIGHT: "knight",
    BISHOP: "bishop",
    QUEEN: "queen",
    KING: "king",
    PAWN: "pawn",
};
const COLORS = {
    WHITE: "white",
    BLACK: "black",
};

// Game state
let board;
let currentDrag = {
    piece: null,
    rowIdx: null,
    colIdx: null,
};

// Piece movement directions
const DIRECTIONS = {
    ROOK: [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
    ],
    BISHOP: [
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
    ],
    QUEEN: [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
    ],
    KING: [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
    ],
    KNIGHT: [
        [2, 1],
        [2, -1],
        [-2, 1],
        [-2, -1],
        [1, 2],
        [1, -2],
        [-1, 2],
        [-1, -2],
    ],
};

// Utility functions
const isValidPosition = (row, col) =>
    row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;

const getPieceAt = (row, col) => {
    return board[row][col].find("img");
};

const setPieceAt = (row, col, pieceElement) => {
    board[row][col].empty();
    if (pieceElement) {
        board[row][col].append(pieceElement);
    }
};

// Piece movement calculation
const calculateLinearMoves = (rowIdx, colIdx, directions, color) => {
    const moves = [];

    for (const [dx, dy] of directions) {
        for (let i = 1; i < BOARD_SIZE; i++) {
            const newRow = rowIdx + dx * i;
            const newCol = colIdx + dy * i;

            if (!isValidPosition(newRow, newCol)) break;

            const pieceAtNewPos = getPieceAt(newRow, newCol);
            if (pieceAtNewPos.length) {
                if (!pieceAtNewPos.hasClass(`${color}-piece`)) {
                    moves.push([newRow, newCol]);
                }
                break;
            }

            moves.push([newRow, newCol]);
        }
    }

    return moves;
};

const calculateSingleStepMoves = (rowIdx, colIdx, moves, color) => {
    return moves
        .filter(([dx, dy]) => {
            const newRow = rowIdx + dx;
            const newCol = colIdx + dy;

            if (!isValidPosition(newRow, newCol)) return false;

            const pieceAtNewPos = getPieceAt(newRow, newCol);
            return (
                !pieceAtNewPos.length ||
                !pieceAtNewPos.hasClass(`${color}-piece`)
            );
        })
        .map(([dx, dy]) => [rowIdx + dx, colIdx + dy]);
};

const calculatePawnMoves = (rowIdx, colIdx, color) => {
    const moves = [];
    const direction = color === COLORS.BLACK ? 1 : -1;
    const startRow = color === COLORS.BLACK ? 1 : 6;

    // Out of bounds check
    if (!isValidPosition(rowIdx + direction, colIdx)) return moves;

    // Forward move
    if (!getPieceAt(rowIdx + direction, colIdx).length) {
        moves.push([rowIdx + direction, colIdx]);

        // Double move from start position
        if (
            rowIdx === startRow &&
            !getPieceAt(rowIdx + 2 * direction, colIdx).length
        ) {
            moves.push([rowIdx + 2 * direction, colIdx]);
        }
    }

    // Capture moves
    const captureMoves = [
        [direction, 1],
        [direction, -1],
    ];
    for (const [dx, dy] of captureMoves) {
        const newRow = rowIdx + dx;
        const newCol = colIdx + dy;
        if (isValidPosition(newRow, newCol)) {
            const pieceAtNewPos = getPieceAt(newRow, newCol);
            if (
                pieceAtNewPos.length &&
                !pieceAtNewPos.hasClass(`${color}-piece`)
            ) {
                moves.push([newRow, newCol]);
            }
        }
    }

    return moves;
};

const calculatePossibleMoves = (piece, rowIdx, colIdx) => {
    const pieceType = piece.attr("class").split(" ")[0];
    const pieceColor = piece.hasClass(`${COLORS.WHITE}-piece`)
        ? COLORS.WHITE
        : COLORS.BLACK;

    switch (pieceType) {
        case PIECE_TYPES.ROOK:
            return calculateLinearMoves(
                rowIdx,
                colIdx,
                DIRECTIONS.ROOK,
                pieceColor
            );
        case PIECE_TYPES.BISHOP:
            return calculateLinearMoves(
                rowIdx,
                colIdx,
                DIRECTIONS.BISHOP,
                pieceColor
            );
        case PIECE_TYPES.QUEEN:
            return calculateLinearMoves(
                rowIdx,
                colIdx,
                DIRECTIONS.QUEEN,
                pieceColor
            );
        case PIECE_TYPES.KING:
            return calculateSingleStepMoves(
                rowIdx,
                colIdx,
                DIRECTIONS.KING,
                pieceColor
            );
        case PIECE_TYPES.KNIGHT:
            return calculateSingleStepMoves(
                rowIdx,
                colIdx,
                DIRECTIONS.KNIGHT,
                pieceColor
            );
        case PIECE_TYPES.PAWN:
            return calculatePawnMoves(rowIdx, colIdx, pieceColor);
        default:
            return [];
    }
};

// Board setup
const createBoard = () => {
    const $grid = $(".grid");
    board = Array.from({ length: BOARD_SIZE }, () =>
        Array(BOARD_SIZE).fill(null)
    );

    for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
        const $cell = $("<div>")
            .addClass("cell")
            .attr("id", i)
            .addClass(
                (Math.floor(i / BOARD_SIZE) + i) % 2 === 0
                    ? "white-cell"
                    : "black-cell"
            );
        $grid.append($cell);

        const row = Math.floor(i / BOARD_SIZE);
        const col = i % BOARD_SIZE;
        board[row][col] = $cell;
    }
};

const setupInitialPosition = () => {
    const pieces = {
        [COLORS.WHITE]: {
            [PIECE_TYPES.ROOK]: "./images/white-rook.png",
            [PIECE_TYPES.KNIGHT]: "./images/white-knight.png",
            [PIECE_TYPES.BISHOP]: "./images/white-bishop.png",
            [PIECE_TYPES.QUEEN]: "./images/white-queen.png",
            [PIECE_TYPES.KING]: "./images/white-king.png",
            [PIECE_TYPES.PAWN]: "./images/white-pawn.png",
        },
        [COLORS.BLACK]: {
            [PIECE_TYPES.ROOK]: "./images/black-rook.png",
            [PIECE_TYPES.KNIGHT]: "./images/black-knight.png",
            [PIECE_TYPES.BISHOP]: "./images/black-bishop.png",
            [PIECE_TYPES.QUEEN]: "./images/black-queen.png",
            [PIECE_TYPES.KING]: "./images/black-king.png",
            [PIECE_TYPES.PAWN]: "./images/black-pawn.png",
        },
    };

    const setupPiece = (row, col, pieceType, color) => {
        const $img = $("<img>")
            .attr("src", pieces[color][pieceType])
            .addClass(`${pieceType} ${color}-piece`);
        setPieceAt(row, col, $img);
    };

    // Setup back rank
    const backRankPieces = [
        PIECE_TYPES.ROOK,
        PIECE_TYPES.KNIGHT,
        PIECE_TYPES.BISHOP,
        PIECE_TYPES.QUEEN,
        PIECE_TYPES.KING,
        PIECE_TYPES.BISHOP,
        PIECE_TYPES.KNIGHT,
        PIECE_TYPES.ROOK,
    ];

    backRankPieces.forEach((pieceType, col) => {
        setupPiece(0, col, pieceType, COLORS.BLACK);
        setupPiece(7, col, pieceType, COLORS.WHITE);
    });

    // Setup pawns
    for (let col = 0; col < BOARD_SIZE; col++) {
        setupPiece(1, col, PIECE_TYPES.PAWN, COLORS.BLACK);
        setupPiece(6, col, PIECE_TYPES.PAWN, COLORS.WHITE);
    }
};

// Event handlers
const handleDragStart = (e) => {
    const $cell = $(e.target).closest(".cell");
    if (!$cell.length) return;

    const $piece = $cell.find("img");
    if (!$piece.length) return;

    currentDrag.piece = $piece;
    currentDrag.rowIdx = Math.floor($cell.attr("id") / BOARD_SIZE);
    currentDrag.colIdx = $cell.attr("id") % BOARD_SIZE;

    $cell.addClass("selected");

    const possibleMoves = calculatePossibleMoves(
        currentDrag.piece,
        currentDrag.rowIdx,
        currentDrag.colIdx
    );

    possibleMoves.forEach(([row, col]) => {
        board[row][col].addClass("reachable");
    });
};

const resetState = () => {
    $(".cell").removeClass("selected reachable");
    currentDrag = { piece: null, rowIdx: null, colIdx: null };
};

const handleDrop = (e) => {
    const $target = $(e.target).closest(".cell");
    if (
        !$target.length ||
        $target.hasClass("selected") ||
        !$target.hasClass("reachable")
    ) {
        resetState();
        return;
    }

    const targetRow = Math.floor($target.attr("id") / BOARD_SIZE);
    const targetCol = $target.attr("id") % BOARD_SIZE;

    setPieceAt(targetRow, targetCol, currentDrag.piece);
    setPieceAt(currentDrag.rowIdx, currentDrag.colIdx, null);

    resetState();
};

// Initialization
const init = () => {
    createBoard();
    setupInitialPosition();

    $(".grid")
        .on("dragstart", "img", handleDragStart)
        .on("dragover", ".cell", (e) => e.preventDefault())
        .on("drop", ".cell", handleDrop);
};

$(document).ready(init);
