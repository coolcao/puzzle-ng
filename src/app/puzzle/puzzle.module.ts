import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { PuzzleRoutingModule } from './puzzle-routing.module';
import { PuzzleBoardComponent } from './puzzle-board/puzzle-board.component';
import { PuzzleStore } from './puzzle.store';
import { PuzzleStartComponent } from './puzzle-start/puzzle-start.component';


@NgModule({
  declarations: [
    PuzzleBoardComponent,
    PuzzleStartComponent
  ],
  imports: [
    CommonModule,
    PuzzleRoutingModule,
    FormsModule,
  ],
  providers: [
    PuzzleStore,
  ]
})
export class PuzzleModule { }
