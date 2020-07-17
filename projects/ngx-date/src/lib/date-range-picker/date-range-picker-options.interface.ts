import { getYear, Locale } from 'date-fns';
import { InjectionToken } from '@angular/core';
import { enUS } from 'date-fns/locale';

export interface DateRangePickerOptions {
  minDate?: Date;
  maxDate?: Date;
  minYear?: number;
  maxYear?: number;
  placeholder?: string;
  format?: string;
  formatTitle?: string;
  formatDays?: string;
  firstCalendarDay?: number;
  locale?: Locale;
  position?: 'left' | 'right' | 'bottom' | 'top';
  inputClass?: string;
  calendarClass?: string;
  scrollBarColor?: string;
}

export const DATERANGEPICKER_OPTIONS = new InjectionToken<DateRangePickerOptions>('DateRangePicker Config');

export function mergeDateRangePickerOptions(opts: DateRangePickerOptions): DateRangePickerOptions {
  return { ...defaultOptions, ...opts };
}

const defaultOptions: DateRangePickerOptions = {
  minYear: getYear(new Date()) - 30,
  maxYear: getYear(new Date()) + 30,
  placeholder: '',
  format: 'yyyy/dd/LL',
  formatTitle: 'LLLL yyyy',
  formatDays: 'EEEEE',
  firstCalendarDay: 0,
  locale: enUS,
  position: 'bottom',
  inputClass: '',
  calendarClass: 'datepicker-default',
  scrollBarColor: '#dfe3e9'
};
