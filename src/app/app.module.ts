import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ObstacleComponent } from './obstacle/obstacle.component';
import { ValueSettingsComponent } from './value-settings/value-settings.component';

@NgModule({
  declarations: [
    AppComponent,
    ObstacleComponent,
    ValueSettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
