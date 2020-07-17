import { NgModule } from '@angular/core';
import { DatepickerModule } from './datepicker/datepicker.module';
import { DateRangePickerModule } from './date-range-picker/date-range-picker.module';

@NgModule({
  imports: [DatepickerModule, DateRangePickerModule],
  exports: [DatepickerModule, DateRangePickerModule]
})
export class NgxDateModule {}
