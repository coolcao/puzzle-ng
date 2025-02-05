import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'puzzle', pathMatch: 'full' },
  { path: 'puzzle', loadChildren: () => import('./puzzle/puzzle.module').then(m => m.PuzzleModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
