import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  { path: '', loadChildren: () => import('./move/move/move-routing.module').then(m => m.MoveRoutingModule) },
  { path: 'css-things', loadChildren: () => import('./css-things/css-things-routing.module').then(m => m.CssThingsRoutingModule) }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }