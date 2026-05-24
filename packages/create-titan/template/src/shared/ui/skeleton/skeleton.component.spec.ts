import { TestBed } from '@angular/core/testing';
import { SkeletonComponent } from './skeleton.component';

describe('SkeletonComponent', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(SkeletonComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
