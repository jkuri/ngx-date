import { Component } from '@angular/core';
import { DatepickerOptions, DateRangePickerOptions } from 'ngx-date';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  date: Date = new Date();
  options: DatepickerOptions = {
    inputClass: 'input',
    calendarClass: 'datepicker-default',
    scrollBarColor: '#010001'
  };
  date2: Date = new Date();
  options2: DatepickerOptions = {
    inputClass: 'input',
    calendarClass: 'datepicker-blue',
    scrollBarColor: '#ffffff'
  };
  date3: Date = new Date();
  options3: DatepickerOptions = {
    inputClass: 'input',
    calendarClass: 'datepicker-dark',
    scrollBarColor: '#ffffff'
  };

  dateRange: string;
  dateRangeOptions: DateRangePickerOptions = {
    inputClass: 'input',
    calendarClass: 'daterangepicker-default',
    scrollBarColor: '#010001'
  };
  dateRange2: string;
  dateRangeOptions2: DateRangePickerOptions = {
    inputClass: 'input',
    calendarClass: 'daterangepicker-blue',
    scrollBarColor: '#010001'
  };
  dateRange3: string;
  dateRangeOptions3: DateRangePickerOptions = {
    inputClass: 'input',
    calendarClass: 'daterangepicker-dark',
    scrollBarColor: '#010001'
  };
}
