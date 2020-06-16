import { NgModule } from '@angular/core';
import { DatepickerModule } from './datepicker/datepicker.module';

@NgModule({
  imports: [
    DatepickerModule
  ],
  exports: [
    DatepickerModule
  ]
})
export class NgxDateModule { }
