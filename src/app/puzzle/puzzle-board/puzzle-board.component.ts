import { Component, effect, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { PuzzleStore } from '../puzzle.store';
import { Cell } from '../puzzle.type';

@Component({
  selector: 'app-puzzle-board',
  standalone: false,

  templateUrl: './puzzle-board.component.html',
  styleUrl: './puzzle-board.component.less'
})
export class PuzzleBoardComponent implements OnInit {
  private readonly boardStore = inject(PuzzleStore);

  @ViewChild('movePlayer') movePlayer!: ElementRef<HTMLAudioElement>;
  @ViewChild('winPlayer') winPlayer!: ElementRef<HTMLAudioElement>;

  cells = this.boardStore.cells;
  finished = this.boardStore.finished;
  steps = this.boardStore.steps;
  difficulty = this.boardStore.difficulty;

  constructor(
    private router: Router
  ) {
    effect(() => {
      if (this.finished()) {
        this.playWinAudio();
      }
    });
  }

  ngOnInit(): void {
    if (this.cells().length === 0) {
      this.router.navigate(['puzzle']);
    }
  }

  // 监听上下左右键盘事件
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const zeroCoord = this.boardStore.getZeroCoord();
    let row = -1, col = -1;

    switch (event.key) {
      case 'ArrowUp': {
        row = zeroCoord.row + 1, col = zeroCoord.col;
        break;
      }
      case 'ArrowDown': {
        row = zeroCoord.row - 1, col = zeroCoord.col;
        break;
      }
      case 'ArrowLeft': {
        row = zeroCoord.row, col = zeroCoord.col + 1;
        break;
      }
      case 'ArrowRight': {
        row = zeroCoord.row, col = zeroCoord.col - 1;
        break;
      }
      default:
        return;
    }

    if (row < 0 || row >= this.cells().length || col < 0 || col >= this.cells()[0].length) {
      return;
    }
    const cell = this.cells()[row][col];
    this.move(cell.value, 0);
  }


  clickCell(cell: Cell) {

    if (cell.value === 0) {
      return;
    }

    const zeroCoord = this.boardStore.getZeroCoord();
    const { row, col } = this.boardStore.getCoordByValue(cell.value);
    // 检查是否相邻
    const isAdjacent = Math.abs(zeroCoord.row - row) + Math.abs(zeroCoord.col - col) === 1;
    if (!isAdjacent) {
      return;
    }

    // 交换
    this.move(cell.value, 0);

  }

  move(fromValue: number, toValue: number) {
    this.playMoveAudio();
    // 移动
    const from = this.boardStore.getCoordByValue(fromValue);
    const to = this.boardStore.getCoordByValue(toValue);
    const cells = this.boardStore.cells().map(row => row.map(cell => ({ ...cell })));
    const temp = cells[from.row][from.col];
    cells[from.row][from.col].value = toValue;
    cells[to.row][to.col].value = fromValue;
    this.boardStore.updateCells(cells);
    this.boardStore.incrementSteps();
  }

  playMoveAudio() {
    this.movePlayer?.nativeElement?.play();
  }
  playWinAudio() {
    this.winPlayer?.nativeElement?.play();
  }

  back() {
    this.router.navigate(['puzzle']);
  }

  restart() {
    this.boardStore.initCells();
    this.boardStore.shuffle();
  }

}
