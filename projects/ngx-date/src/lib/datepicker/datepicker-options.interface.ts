import { getYear, Locale } from 'date-fns';
import { InjectionToken } from '@angular/core';
import { enUS } from 'date-fns/locale';

export interface DatepickerOptions {
  minDate?: Date;
  maxDate?: Date;
  minYear?: number;
  maxYear?: number;
  format?: string;
  formatTitle?: string;
  formatDays?: string;
  firstCalendarDay?: number;
  locale?: Locale;
  position?: 'left' | 'right' | 'bottom' | 'top';
  class?: string;
}

export const DATEPICKER_OPTIONS = new InjectionToken<DatepickerOptions>('Datepicker config');

export function mergeOptions(opts: DatepickerOptions): DatepickerOptions {
  return { ...defaultOptions, ...opts };
}

const defaultOptions: DatepickerOptions = {
  minYear: getYear(new Date()) - 30,
  maxYear: getYear(new Date()) + 30,
  format: 'MMM D[,] YYYY',
  formatTitle: 'LLLL yyyy',
  formatDays: 'EEEEE',
  firstCalendarDay: 0,
  locale: enUS,
  position: 'bottom'
};
