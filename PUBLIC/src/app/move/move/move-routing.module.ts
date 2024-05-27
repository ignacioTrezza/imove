import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MoveComponent } from './move.component';

const routes: Routes = [
  { path: '', component: MoveComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoveRoutingModule { }

