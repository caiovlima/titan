import { TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';

describe('InputComponent', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(InputComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
