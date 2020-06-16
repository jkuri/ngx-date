import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSlimScrollModule } from 'ngx-slimscroll';
import { DatepickerOptions, DATEPICKER_OPTIONS, mergeOptions } from './datepicker-options.interface';
import { DatepickerComponent } from './datepicker.component';

@NgModule({
  imports: [CommonModule, FormsModule, NgSlimScrollModule],
  declarations: [DatepickerComponent],
  exports: [DatepickerComponent]
})
export class DatepickerModule {
  static forRoot(options: DatepickerOptions): ModuleWithProviders {
    return {
      ngModule: DatepickerModule,
      providers: [{ provide: DATEPICKER_OPTIONS, useValue: mergeOptions(options) }]
    };
  }
}
