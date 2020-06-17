import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatepickerModule } from 'ngx-date';
import { AppComponent } from './app.component';
import { TerminalComponent } from './terminal/terminal.component';

@NgModule({
  declarations: [
    AppComponent,
    TerminalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    DatepickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
