import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewPass } from './new-pass';

describe('NewPass', () => {
  let component: NewPass;
  let fixture: ComponentFixture<NewPass>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPass],
    }).compileComponents();

    fixture = TestBed.createComponent(NewPass);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
