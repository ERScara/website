import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentSection } from './comment-section';

describe('CommentSection', () => {
  let component: CommentSection;
  let fixture: ComponentFixture<CommentSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentSection],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
