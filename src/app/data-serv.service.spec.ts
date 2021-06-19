import { TestBed } from '@angular/core/testing';

import { DataServService } from './data-serv.service';

describe('DataServService', () => {
  let service: DataServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
