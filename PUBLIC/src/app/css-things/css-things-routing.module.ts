import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CssThingsComponent } from './css-things.component';
import { AuthGuard } from '../auth/auth.guard';  // Ensure you have the correct path to AuthGuard

const routes: Routes = [
  { path: '', component: CssThingsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CssThingsRoutingModule { }