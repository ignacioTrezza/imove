import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CssThingsComponent } from './css-things.component';
import { ZIndex1Component } from './z-index-1/z-index-1.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';


const routes: Routes = [
  { path: '', component: CssThingsComponent },
  // { path: 'indexa', component: ZIndex1Component }
];

@NgModule({
  declarations: [
    CssThingsComponent,
    ZIndex1Component
  ],
  imports: [
    CommonModule,  
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    ColorPickerModule ,
  ],
  exports: [
    CssThingsComponent,
    ZIndex1Component
  ]
})
export class CssThingsModule { }
