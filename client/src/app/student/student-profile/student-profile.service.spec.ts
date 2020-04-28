import { TestBed } from '@angular/core/testing';

import { StudentProfileService } from './student-profile.service';

describe('StudentService', () => {
  let service: StudentProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
