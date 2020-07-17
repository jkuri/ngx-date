import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSlimScrollModule } from 'ngx-slimscroll';
import {
  DateRangePickerOptions,
  DATERANGEPICKER_OPTIONS,
  mergeDateRangePickerOptions
} from './date-range-picker-options.interface';
import { DateRangePickerComponent } from './date-range-picker.component';

@NgModule({
  imports: [CommonModule, FormsModule, NgSlimScrollModule],
  declarations: [DateRangePickerComponent],
  exports: [DateRangePickerComponent]
})
export class DateRangePickerModule {
  static forRoot(options: DateRangePickerOptions): ModuleWithProviders<DateRangePickerModule> {
    return {
      ngModule: DateRangePickerModule,
      providers: [{ provide: DATERANGEPICKER_OPTIONS, useValue: mergeDateRangePickerOptions(options) }]
    };
  }
}
