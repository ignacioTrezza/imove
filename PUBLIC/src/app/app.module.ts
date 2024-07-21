import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { appReducer, metaReducers } from './core/store/reducers/app.reducer';
import { AppComponent } from './app.component';
// Removed imports for AnotherSubscriberComponent and RealExpressComponent since they are standalone
import { AccelerometerDisplayComponent } from './componentes/accelerometer-display/accelerometer-display.component';
import { AccelerometerIncludingGravityDisplayComponent } from './componentes/gravity-display/accelerometer-including-gravity-display.component';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RealExpressComponent } from './componentes/real-express/real-express.component';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './core/store/effects/app.effect';
import { GyroscopeDisplayComponent } from './componentes/gyroscope-display/gyroscope-display.component';
import { AppRoutingModule } from './app-routing.module';
import { MoveModule } from './move/move.module';
import { AuthModule } from './auth/auth.module';
import { BrowserModule } from '@angular/platform-browser';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { DashboardModule } from './dashboard/dashboard.module';
import { CssThingsModule } from './css-things/css-things.module';

@NgModule({
    declarations: [
        AppComponent, 

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
