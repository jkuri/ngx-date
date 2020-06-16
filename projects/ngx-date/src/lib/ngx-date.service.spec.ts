import { TestBed } from '@angular/core/testing';

import { NgxDateService } from './ngx-date.service';

describe('NgxDateService', () => {
  let service: NgxDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
