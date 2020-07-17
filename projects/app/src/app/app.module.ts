import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatepickerModule, DateRangePickerModule } from 'ngx-date';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, DatepickerModule, DateRangePickerModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
