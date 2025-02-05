import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PuzzleBoardComponent } from './puzzle-board/puzzle-board.component';
import { PuzzleStartComponent } from './puzzle-start/puzzle-start.component';

const routes: Routes = [
  { path: '', component: PuzzleStartComponent },
  { path: 'board', component: PuzzleBoardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PuzzleRoutingModule { }
