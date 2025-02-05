import { computed, Injectable, signal } from "@angular/core";
import { Cell } from "./puzzle.type";

const directions = [
  [-1, 0], // 向上
  [1, 0],  // 向下
  [0, -1], // 向左
  [0, 1]   // 向右
];

@Injectable()
export class PuzzleStore {
  private _size = signal<3 | 4 | 5>(3);
  private _difficulty = signal<1 | 2 | 3>(1);
  private _cells = signal<Cell[][]>([]);
  private _steps = signal(0);

  readonly cells = this._cells.asReadonly();
  readonly difficulty = this._difficulty.asReadonly();
  readonly size = this._size.asReadonly();
  readonly steps = this._steps.asReadonly();

  finished = computed(() => {
    let finished = true;
    const cells = this.cells();
    for (let i = 0; i < cells.length; i++) {
      for (let j = 0; j < cells[i].length; j++) {
        if (cells[i][j].value !== cells[i][j].id) {
          finished = false;
        }
      }
    }

    return finished;
  });

  getCoordByValue(value: number) {
    let row = 0, col = 0;
    for (let i = 0; i < this._cells().length; i++) {
      for (let j = 0; j < this._cells()[0].length; j++) {
        if (this.cells()[i][j].value === value) {
          row = i;
          col = j;
        }
      }
    }
    return { row, col };
  }

  getZeroCoord() {
    for (let i = 0; i < this._cells().length; i++) {
      for (let j = 0; j < this._cells()[i].length; j++) {
        if (this._cells()[i][j].value === 0) {
          return { row: i, col: j };
        }
      }
    }
    return { row: 0, col: 0 };
  }

  updateCells(cells: Cell[][]) {
    this._cells.set(cells);
  }

  setDifficulty(difficulty: 1 | 2 | 3) {
    this._difficulty.set(difficulty);
  }
  setSize(size: 3 | 4 | 5) {
    this._size.set(size);
  }

  initCells() {
    this._cells.set(this._generateCells(this.size(), this.size()));
  }

  shuffle() {
    this._shuffle(this._cells(), this.difficulty());
    this._steps.set(0);
  }

  incrementSteps() {
    this._steps.set(this._steps() + 1);
  }

  // 洗牌
  // 困难等级：1-简单，2-中等，3-困难
  private _shuffle(board: Cell[][], difficulty: 1 | 2 | 3): void {
    if (!board.length || !board[0].length) {
      throw new Error("Invalid board");
    }
    const steps = this._getShuffleSteps(difficulty);
    let blankPos = this._findBlankPosition(board);

    for (let i = 0; i < steps; i++) {
      const validMoves = this._getValidMoves(blankPos, board.length, board[0].length);
      const move = validMoves[Math.floor(Math.random() * validMoves.length)];
      const newBlankPos = { row: blankPos.row + move[0], col: blankPos.col + move[1] };
      this._swapValues(board, blankPos, newBlankPos);
      blankPos = newBlankPos;
    }

    // 排除掉已还原的棋盘，重新洗牌
    let finished = true;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j].value !== board[i][j].id) {
          finished = false;
        }
      }
    }
    if (finished) {
      this._shuffle(board, difficulty);
    }
  }

  // 生成一个rows*cols的棋盘数据
  private _generateCells(rows: number, cols: number): Cell[][] {
    const board: Cell[][] = [];
    let counter = 1;

    for (let row = 0; row < rows; row++) {
      const currentRow: Cell[] = [];
      for (let col = 0; col < cols; col++) {
        const value = row === rows - 1 && col === cols - 1 ? 0 : counter++;
        currentRow.push({
          id: value,
          value: value,
        });
      }
      board.push(currentRow);
    }

    board[rows - 1][cols - 1].id = 0;
    board[rows - 1][cols - 1].value = 0;

    return board;
  }

  private _getShuffleSteps(difficulty: number): number {
    switch (difficulty) {
      case 1: return 10;  // 简单，操作步骤控制在10步之内
      case 2: return 30;  // 中等，操作步骤控制在30步之内
      case 3: return 50;  // 困难，操作步骤控制在50步之内
      default: throw new Error("Invalid difficulty level");
    }
  }

  private _findBlankPosition(board: Cell[][]): { row: number, col: number } {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col].value === 0) {
          return { row, col };
        }
      }
    }
    throw new Error("No blank cell found");
  }

  private _getValidMoves(blankPos: { row: number, col: number }, rows: number, cols: number): number[][] {
    return directions.filter(([dRow, dCol]) => {
      const newRow = blankPos.row + dRow;
      const newCol = blankPos.col + dCol;
      return newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols;
    });
  }

  private _swapValues(board: Cell[][], pos1: { row: number, col: number }, pos2: { row: number, col: number }): void {
    const temp = board[pos1.row][pos1.col].value;
    board[pos1.row][pos1.col].value = board[pos2.row][pos2.col].value;
    board[pos2.row][pos2.col].value = temp;
  }
}
