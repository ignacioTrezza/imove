import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CssThingsComponent } from './css-things.component';
import { ZIndex1Component } from './z-index-1/z-index-1.component';

const routes: Routes = [
  // { path: '', component: CssThingsComponent },
  { path: '', component: ZIndex1Component }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CssThingsRoutingModule { }