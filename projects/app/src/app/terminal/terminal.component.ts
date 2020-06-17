import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.sass']
})
export class TerminalComponent implements OnInit, OnChanges {
  @Input() code: string;

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(): void {
    if (!this.code) {
      return;
    }
  }
}
