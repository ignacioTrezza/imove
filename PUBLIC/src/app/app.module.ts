import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { appReducer, metaReducers } from './core/store/reducers/app.reducer';
import { AppComponent } from './app.component';
import { DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './core/store/effects/app.effect';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { DashboardModule } from './dashboard/dashboard.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,      
        AppRoutingModule,  
        FormsModule,
        AuthModule,
        DashboardModule,
        HttpClientModule,
        ReactiveFormsModule,
        StoreModule.forRoot({ app: appReducer }, { metaReducers }),      
        EffectsModule.forRoot([AppEffects]), 
    ],
    exports: [
    ],
    providers: [
        DecimalPipe // Provide DecimalPipe if it's being injected
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
