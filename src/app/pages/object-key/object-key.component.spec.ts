import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObjectKeyComponent } from './object-key.component';

describe('ObjectKeyComponent', () => {
  let component: ObjectKeyComponent;
  let fixture: ComponentFixture<ObjectKeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ObjectKeyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
