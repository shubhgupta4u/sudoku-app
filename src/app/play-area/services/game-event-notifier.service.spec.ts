import { TestBed } from '@angular/core/testing';

import { GameEventNotifierService } from './game-event-notifier.service';

describe('GameEventNotifierService', () => {
  let service: GameEventNotifierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEventNotifierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
