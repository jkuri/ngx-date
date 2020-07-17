import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  HostListener,
  ElementRef,
  EventEmitter
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ISlimScrollOptions, SlimScrollEvent } from 'ngx-slimscroll';
import { DateRangePickerOptions, mergeDateRangePickerOptions } from './date-range-picker-options.interface';
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
  setYear,
  startOfDay,
  isWithinInterval,
  addDays
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
  from: boolean;
  to: boolean;
  isWithinRange: boolean;
}

@Component({
  selector: 'ngx-daterangepicker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.sass'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: DateRangePickerComponent, multi: true }]
})
export class DateRangePickerComponent implements ControlValueAccessor, OnInit, OnChanges {
  @Input() options: DateRangePickerOptions;
  @Input() scrollOptions: ISlimScrollOptions;
  @Input() opened: false | 'from' | 'to' = false;

  innerValue: string;
  displayValue: string;
  view: 'days' | 'years';
  date: Date;
  dateFrom: Date;
  dateTo: Date;
  years: { year: number; isThisYear: boolean }[] = [];
  days: Day[] = [];
  dayNames: string[] = [];
  scrollEvents = new EventEmitter<SlimScrollEvent>();

  get value(): string {
    return this.innerValue;
  }

  set value(val: string) {
    this.innerValue = val;
    this.displayValue = this.value;
    this.onChangeCallback(this.innerValue);
  }

  constructor(public elementRef: ElementRef) {
    this.styleScrollbar();
  }

  get title(): string {
    return format(this.date, this.options.formatTitle);
  }

  ngOnInit(): void {
    this.view = 'days';
    this.date = startOfDay(new Date());
    this.init();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('options' in changes) {
      this.options = mergeDateRangePickerOptions(this.options);
      this.styleScrollbar();
      this.init();
    }
  }

  toggleCalendar(selection: 'from' | 'to'): void {
    if (this.opened && this.opened !== selection) {
      this.opened = selection;
    } else {
      this.opened = this.opened ? false : selection;
    }
  }

  closeCalendar(): void {
    this.opened = false;
  }

  toggleView(): void {
    this.view = this.view === 'days' ? 'years' : 'days';
    if (this.view === 'years') {
      setTimeout(() => this.scrollToYear());
    }
  }

  nextMonth(): void {
    this.date = addMonths(this.date, 1);
    this.initDays();
  }

  prevMonth(): void {
    this.date = subMonths(this.date, 1);
    this.initDays();
  }

  selectDate(e: MouseEvent, index: number): void {
    e.preventDefault();
    this.date = this.days[index].date;
    if (
      (this.opened === 'from' && isAfter(this.date, this.dateTo)) ||
      (this.opened === 'to' && isBefore(this.date, this.dateFrom))
    ) {
      return;
    }

    if (this.opened === 'from') {
      this.dateFrom = this.date;
      this.opened = 'to';
    } else if (this.opened === 'to') {
      this.dateTo = this.date;
      this.opened = 'from';
    }

    this.initDays();
    const from = format(this.dateFrom, this.options.format, { locale: this.options.locale });
    const to = format(this.dateTo, this.options.format, { locale: this.options.locale });
    this.value = `${from}-${to}`;
  }

  setYear(i: number): void {
    this.date = setYear(this.date, this.years[i].year);
    this.initDays();
    this.initYears();
    this.view = 'days';
  }

  private scrollToYear(): void {
    const parent = this.elementRef.nativeElement.querySelector('.main-calendar-years');
    const el = this.elementRef.nativeElement.querySelector('.year-unit.is-selected');
    const y = el.offsetTop - parent.clientHeight / 2 + el.clientHeight / 2;
    const event = new SlimScrollEvent({ type: 'scrollTo', y, duration: 100 });
    this.scrollEvents.emit(event);
  }

  private init(): void {
    this.dateFrom = this.dateFrom || new Date();
    this.dateTo = this.dateTo || addDays(new Date(), 7);
    this.initDayNames();
    this.initDays();
    this.initYears();
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
      isSelected: isSameDay(date, this.date) && isSameMonth(date, this.date) && isSameYear(date, this.date),
      isSelectable: this.isDateSelectable(date),
      from: isSameDay(this.dateFrom, date),
      to: isSameDay(this.dateTo, date),
      isWithinRange: isWithinInterval(date, { start: this.dateFrom, end: this.dateTo })
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

  private styleScrollbar(): void {
    this.scrollOptions = {
      barBackground: (this.options && this.options.scrollBarColor) || '#dfe3e9',
      gridBackground: 'transparent',
      barBorderRadius: '3',
      gridBorderRadius: '3',
      barWidth: '6',
      gridWidth: '6',
      barMargin: '0',
      gridMargin: '0'
    };
  }

  writeValue(val: string): void {
    if (!val) {
      return;
    }
    this.innerValue = val;
    this.displayValue = val;
    this.init();
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  private onTouchedCallback: () => void = () => {};
  private onChangeCallback: (_: any) => void = () => {};

  @HostListener('document:click', ['$event']) onBlur(e: MouseEvent) {
    if (!this.opened) {
      return;
    }

    if (!this.elementRef.nativeElement.contains(e.target) && !(e.target as HTMLElement).classList.contains('day-num')) {
      this.closeCalendar();
    }
  }
}
