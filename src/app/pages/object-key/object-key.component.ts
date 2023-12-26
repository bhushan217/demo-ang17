import { Component, OnInit, signal, inject, computed, Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule } from '@ngx-formly/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ObjectKeyStateService } from './store/object-key.state-service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ObjectKey } from './store/object-key.model';
import { Observable, map, tap } from 'rxjs';
import { ObjectKeysPageActions } from './store/object-key-page.actions';
import { UiTypeStateService } from '../ui-type/store/ui-type.state-service';
import { UiType } from '../ui-type/store/ui-type.model';
import { IKeyVal } from 'app/shared/interfaces/api-interface.service';

@Component({
  selector: 'app-object-key',
  standalone: true,
  imports: [
    FormlyModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzButtonModule,
    NzIconModule,
    NzTableModule,
    NzPopconfirmModule,
    NzModalModule
  ],
  providers:[UiTypeStateService, ObjectKeyStateService],
  templateUrl: './object-key.component.html',
  styleUrl: './object-key.component.css',
})
export class ObjectKeyComponent implements OnInit {
  uiTypeStore = inject(UiTypeStateService).store;
  store = inject(ObjectKeyStateService).store;
  removeOne$ = ObjectKeysPageActions.deleteObjectKey$;
  saveOne$ = ObjectKeysPageActions.saveObjectKey$;
  activeObjectId$ = this.store.activeObjectKeyId$ ;
  totalCount$ = this.store.totalCount$ ;
  isLoading$ = this.store.isLoading$;
  error$ = this.store.error$;
  isConfirmLoading = false;
  editId: number = 0;
  initObjectKey: ObjectKey = {id: this.editId, keyName: null, label: null, description: null, uiTypeId: null};
  activeObjectKey: ObjectKey = {...this.initObjectKey};
  uiTypesAllKeyVals$: Observable<IKeyVal[]> = this.uiTypeStore.uiTypesAll$.pipe( map((uiTypes:UiType[]) => uiTypes.map((ui:UiType) => ({label:ui.description, value: ui.id} as IKeyVal))));

  constructor(
    // private objectKeysRepo: ObjectKeyStateService,
    private nzMessageService: NzMessageService
  ) {
  }

  // readonly searchCriteria = signal('');
  // readonly result$ = toObservable(this.searchCriteria).pipe(
  //   filter((criteria) => criteria.length > 4),
  //   switchMap((criteria) => this.objectKeysRepo.store.objectKeysAll$({}))
  // );
  readonly uiTypeKVs$ = toSignal(this.uiTypesAllKeyVals$, { 
    initialValue: [] as IKeyVal[] 
  });
  readonly getLabelByUiTypeId = (id: number, kVs: Signal<IKeyVal[]>) => { return (kVs().find((ui:IKeyVal) => ui.value === id)?.label ?? '')};
  readonly objectKeyList$ = toSignal(this.store.objectKeysAll$
    .pipe(map((ok: ObjectKey[])=> ok.map(o => ({...o, uiTypeName: this.getLabelByUiTypeId(o.uiTypeId||0, this.uiTypeKVs$)}as ObjectKey)))), { 
    initialValue: [] as ObjectKey[] 
  });

  ngOnInit(): void {}

  
  beforeConfirm(): Observable<boolean> {
    return new Observable(observer => {
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
  startEdit(data: ObjectKey): void {
    this.editId = data.id;
    this.activeObjectKey = {...data};
    this.nzMessageService.info('clicked Edit');
    this.isVisible = true;
  }

  saveEdit(): void {
    this.store.updateObjectKey([this.editId, {...this.activeObjectKey}])
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
    this.activeObjectKey = {...this.initObjectKey}
  }

  
  form = new FormGroup({});
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {key: 'keyName', type: 'input', props: { label: 'Name', required: true}},
    {key: 'label', type: 'input', props: { label: 'Label', required: true}},
    {key: 'description', type: 'textarea', props: { label: 'Description', required: true}},
    {key: 'uiTypeId', type: 'select', props: { label: 'UI Type', required: true, options: this.uiTypesAllKeyVals$}},
  ];

  isVisible = false;
  onSubmit(answers: ObjectKey){
    console.log({answers});
    this.nzMessageService.info('clicked Save');
    this.saveOne$.next({...this.activeObjectKey})
    this.resetEdit();
  }

}


