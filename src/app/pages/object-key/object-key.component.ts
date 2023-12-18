import { Component, OnInit, signal } from '@angular/core';
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
import { Observable } from 'rxjs';
import { ObjectKeysPageActions } from './store/object-key-page.actions';

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
  templateUrl: './object-key.component.html',
  styleUrl: './object-key.component.css',
})
export class ObjectKeyComponent implements OnInit {
  isConfirmLoading = false;
  editId: number = 0;
  initObjectKey: ObjectKey = {id: this.editId, keyName: null, label: null, description: null, uiTypeId: null};
  activeObjectKey: ObjectKey = {...this.initObjectKey};

  constructor(
    private objectKeysRepo: ObjectKeyStateService,
    private nzMessageService: NzMessageService
  ) {
    // this.activeObjectKeyId$ = this.objectKeysRepo.store.activeObjectKeyId$
  }

  // readonly searchCriteria = signal('');
  // readonly result$ = toObservable(this.searchCriteria).pipe(
  //   filter((criteria) => criteria.length > 4),
  //   switchMap((criteria) => this.objectKeysRepo.store.objectKeysAll$({}))
  // );
  readonly objectKeyList$ = toSignal(this.objectKeysRepo.store.objectKeysAll$, { 
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
    this.objectKeysRepo.store.updateObjectKey([this.editId, {...this.activeObjectKey}])
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
    this.objectKeysRepo.store.removeObjectKeysOne(id)
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
  ];

  isVisible = false;
  onSubmit(answers: ObjectKey){
    console.log({answers});
    this.nzMessageService.info('clicked Save');
    this.objectKeysRepo.store.addObjectKey(answers);
    this.resetEdit();
  }

}
