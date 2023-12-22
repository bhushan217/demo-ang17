import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiTypeComponent } from './ui-type.component';
import { defaultStoreProvider } from '@state-adapt/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UiTypeStateService } from './store/ui-type.state-service';
import { UiTypesApiService } from './store/ui-type.service';

describe('UiTypeComponent', () => {
  let component: UiTypeComponent;
  let fixture: ComponentFixture<UiTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiTypeComponent, HttpClientTestingModule],
      providers: [defaultStoreProvider, UiTypeStateService, UiTypesApiService],
    }).compileComponents();

    fixture = TestBed.createComponent(UiTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
