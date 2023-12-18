import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  FormlyFieldConfig,
  FormlyFormOptions,
  FormlyModule,
} from '@ngx-formly/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable } from 'rxjs';
import { UiType } from './store/ui-type.model';
import { UiTypeStateService } from './store/ui-type.state-service';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { UiTypesPageActions } from './store/ui-type-page.actions';

@Component({
  selector: 'app-ui-type',
  standalone: true,
  providers: [NzInputDirective],
  imports: [
    FormlyModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzModalModule,
    NzButtonModule,
    NzIconModule,
    NzTableModule,
    NzPopconfirmModule,
  ],
  templateUrl: './ui-type.component.html',
  styleUrl: './ui-type.component.css',
})
export class UiTypeComponent {
  uiTypes: UiType[] = [];
  editId: number = 0;
  initUiType: UiType = { id: this.editId };
  activeUiType: UiType = { ...this.initUiType };
  isConfirmLoading = false;

  store = inject(UiTypeStateService).store;
  removeOne$ = UiTypesPageActions.deleteUiType$;
  saveOne$ = UiTypesPageActions.saveUiType$;
  isLoading$ = this.store.isLoading$;
  error$ = this.store.error$;

  constructor(
    private nzMessageService: NzMessageService
  ) {}

  ngOnInit(): void {
    this.store.uiTypesAll$.subscribe((data) => {
      this.uiTypes = data;
    });
  }

  beforeConfirm(): Observable<boolean> {
    return new Observable((observer) => {
      // this.store.removeUiTypesOne(this.editId)
      setTimeout(() => {
        observer.next(true);
        observer.complete();
      }, 3000);
    });
  }

  onRemoveSuccess(id: number) {
    console.debug({id})
    this.nzMessageService.info('clicked Delete');
  }
  startEdit(data: UiType): void {
    this.store.activeUiTypeId$
    this.editId = data.id;
    this.activeUiType = {...data}
    this.nzMessageService.info('clicked Edit');
    this.isVisible = true;
  }

  saveEdit(): void {
    this.saveOne$.next({...this.activeUiType})
  }
  
  beforeRemoveConfirm(): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(true);
        observer.complete();
      }, 3000);
    });
  }
  counter = 0;
  addNewRow(): void {
    this.resetEdit();
    this.editId = -(++this.counter);
    this.isVisible = true;
  }

  onRemoveConfrim(id: number) {
    console.debug({id})
    this.removeOne$.next(id);
    this.nzMessageService.info('clicked Delete');
  }
  resetEdit() {
    this.isVisible = false;
    this.editId = 0;
    this.activeUiType = {...this.initUiType}
  }

  form = new FormGroup({});
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    { key: 'name', type: 'input', props: { label: 'Name', required: true } },
    {
      key: 'description',
      type: 'textarea',
      props: { label: 'Description', required: true },
    },
    { key: 'pattern', type: 'input', props: { label: 'Pattern', required: false } },
  ];

  isVisible = false;
  onSubmit(answers: UiType) {
    console.log({ answers });
    this.nzMessageService.info('clicked Save');
    this.store.addUiTypesOne(answers);
    this.resetEdit();
  }
}
