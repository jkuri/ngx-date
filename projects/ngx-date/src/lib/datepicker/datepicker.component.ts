import { Component, OnInit, Input, OnChanges, SimpleChanges, HostListener, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ISlimScrollOptions } from 'ngx-slimscroll';
import { DatepickerOptions, mergeOptions } from './datepicker-options.interface';
import {
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  getDate,
  getMonth,
  getYear,
  isToday,
  isSameDay,
  isSameMonth,
  isSameYear,
  isBefore,
  isAfter,
  getDay,
  subDays,
  setDay,
  format,
  addMonths,
  subMonths,
  setYear
} from 'date-fns';

interface Day {
  date: Date;
  day: number;
  month: number;
  year: number;
  inThisMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isSelectable: boolean;
}

@Component({
  selector: 'ngx-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.sass'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: DatepickerComponent, multi: true }
  ]
})
export class DatepickerComponent implements ControlValueAccessor, OnInit, OnChanges {
  @Input() options: DatepickerOptions;
  @Input() scrollOptions: ISlimScrollOptions;
  @Input() isOpened = false;

  innerValue: Date;
  displayValue: string;
  view: 'days' | 'years';
  date: Date;
  years: { year: number; isThisYear: boolean }[] = [];
  days: Day[] = [];
  dayNames: string[] = [];

  get value(): Date {
    return this.innerValue;
  }

  set value(val: Date) {
    this.innerValue = val;
    this.displayValue = format(this.innerValue, this.options.format, { locale: this.options.locale });
    this.onChangeCallback(this.innerValue);
  }

  constructor(public elementRef: ElementRef) {
    this.scrollOptions = {
      barBackground: '#DFE3E9',
      gridBackground: '#FFFFFF',
      barBorderRadius: '3',
      gridBorderRadius: '3',
      barWidth: '6',
      gridWidth: '6',
      barMargin: '0',
      gridMargin: '0'
    };
  }

  get title(): string {
    return format(this.date, this.options.formatTitle);
  }

  ngOnInit(): void {
    this.view = 'days';
    this.date = new Date();
    this.initDayNames();
    this.initDays();
    this.initYears();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('options' in changes) {
      this.options = mergeOptions(this.options);
    }
  }

  toggle(): void {
    this.isOpened = !this.isOpened;
  }

  toggleView(): void {
    this.view = this.view === 'days' ? 'years' : 'days';
  }

  nextMonth(): void {
    this.date = addMonths(this.date, 1);
    this.initDays();
  }

  prevMonth(): void {
    this.date = subMonths(this.date, 1);
    this.initDays();
  }

  setDate(i: number): void {
    this.date = this.days[i].date;
    this.value = this.date;
    this.initDays();
    this.isOpened = false;
  }

  setYear(i: number): void {
    this.date = setYear(this.date, this.years[i].year);
    this.initDays();
    this.initYears();
    this.view = 'days';
  }

  private initDays(): void {
    const date = this.date || new Date();
    const [start, end] = [startOfMonth(date), endOfMonth(date)];

    this.days = eachDayOfInterval({ start, end }).map((d: Date) => this.generateDay(d));

    const tmp = getDay(start) - this.options.firstCalendarDay;
    const prevDays = tmp < 0 ? 7 - this.options.firstCalendarDay : tmp;
    for (let i = 1; i <= prevDays; i++) {
      const d = subDays(start, i);
      this.days.unshift(this.generateDay(d, false));
    }
  }

  private initYears(): void {
    const range = this.options.maxYear - this.options.minYear + 1;
    this.years = Array.from(new Array(range), (_, i) => i + this.options.minYear).map(year => {
      return { year, isThisYear: year === getYear(this.date) };
    });
  }

  private initDayNames(): void {
    this.dayNames = [];
    const start = this.options.firstCalendarDay;
    for (let i = start; i <= 6 + start; i++) {
      const date = setDay(new Date(), i);
      this.dayNames.push(format(date, this.options.formatDays, { locale: this.options.locale }));
    }
  }

  private generateDay(date: Date, inThisMonth: boolean = true): Day {
    return {
      date,
      day: getDate(date),
      month: getMonth(date),
      year: getYear(date),
      inThisMonth,
      isToday: isToday(date),
      isSelected: isSameDay(date, this.innerValue) && isSameMonth(date, this.innerValue) && isSameYear(date, this.innerValue),
      isSelectable: this.isDateSelectable(date)
    };
  }

  private isDateSelectable(date: Date): boolean {
    if (this.options.minDate && isBefore(this.options.minDate, date)) {
      return false;
    }

    if (this.options.maxDate && isAfter(this.options.maxDate, date)) {
      return false;
    }

    return true;
  }

  writeValue(val: Date): void {
    if (!val) {
      return;
    }
    this.innerValue = val;
    this.displayValue = format(this.innerValue, this.options.format, { locale: this.options.locale });
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  private onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => void = () => { };

  @HostListener('document:click', ['$event']) onBlur(e: MouseEvent) {
    if (!this.isOpened) {
      return;
    }

    const input = this.elementRef.nativeElement.querySelector('.datepicker-container > input');
    if (!input) {
      return;
    }

    if (e.target === input || input.contains(e.target)) {
      return;
    }

    const container = this.elementRef.nativeElement.querySelector('.datepicker-calendar-container');
    if (container && container !== e.target &&
      !container.contains(e.target) &&
      !(e.target as HTMLElement).classList.contains('year-unit')) {
      this.isOpened = false;
    }
  }
}
