import { Component, inject } from '@angular/core';
import { PuzzleStore } from '../puzzle.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-puzzle-start',
  standalone: false,

  templateUrl: './puzzle-start.component.html',
  styleUrl: './puzzle-start.component.less'
})
export class PuzzleStartComponent {
  puzzleStore = inject(PuzzleStore);
  difficulty = this.puzzleStore.difficulty;
  size = this.puzzleStore.size;

  constructor(
    private router: Router
  ) {}

  changeDifficulty(d: 1 | 2 | 3) {
    this.puzzleStore.setDifficulty(d);
  }

  changeSize(s: 3 | 4 | 5) {
    this.puzzleStore.setSize(s);
  }

  start() {
    this.puzzleStore.initCells();
    this.puzzleStore.shuffle();
    this.router.navigate(['puzzle','board']);
  }
}
