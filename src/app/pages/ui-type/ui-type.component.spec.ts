import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiTypeComponent } from './ui-type.component';

describe('UiTypeComponent', () => {
  let component: UiTypeComponent;
  let fixture: ComponentFixture<UiTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ UiTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
