import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CssThingsRoutingModule } from './css-things-routing.module';
import { CssThingsComponent } from './css-things.component';
import { ZIndex1Component } from './z-index-1/z-index-1.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    CssThingsComponent,
    ZIndex1Component
  ],
  imports: [
    CommonModule,
    BrowserModule,
    CssThingsRoutingModule
  ],
  exports: [
    CssThingsComponent,
    ZIndex1Component
  ]
})
export class CssThingsModule { }
