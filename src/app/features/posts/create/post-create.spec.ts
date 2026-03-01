import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostCreate } from './post-create';

describe('PostCreate', () => {
  let component: PostCreate;
  let fixture: ComponentFixture<PostCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(PostCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
