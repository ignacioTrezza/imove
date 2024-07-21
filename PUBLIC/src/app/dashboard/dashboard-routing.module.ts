import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { ChromeComponent } from './components/chrome/chrome.component';
import { Vm1Component } from './components/vm1/vm1.component';
import { Vm2Component } from './components/vm2/vm2.component';
import { DashboardComponent } from './dashboard.component';
import { MoveComponent } from '../move/move.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'main', component: MainComponent },
  { path: 'chrome', component: ChromeComponent },
  { path: 'vm1', component: Vm1Component },
  { path: 'vm2', component: Vm2Component },
  { path: 'move', component: MoveComponent},
  { path: 'css-things', loadChildren: () => import('../css-things/css-things.module').then(m => m.CssThingsModule) },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }