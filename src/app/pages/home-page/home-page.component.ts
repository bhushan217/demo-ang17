import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { UiTypeStateService } from '../ui-type/store/ui-type.state-service';
import { ObjectKeyStateService } from '../object-key/store/object-key.state-service';
import { UiType } from 'app/pages/ui-type/store/ui-type.model';
import { ObjectKey } from 'app/pages/object-key/store/object-key.model';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  FormlyFieldConfig,
  FormlyFormOptions,
  FormlyModule,
} from '@ngx-formly/core';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

import { NzMessageService } from 'ng-zorro-antd/message';


@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
     CommonModule, FormsModule, ReactiveFormsModule, FormlyModule,
     NzFormModule, NzButtonModule, NzIconModule, NzTableModule, NzPopconfirmModule,
    ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.sass',
})
export class HomePageComponent implements OnInit, OnDestroy {

  @Output() remove = new EventEmitter();

  constructor(
    private uiTypesRepo: UiTypeStateService,
    private objectKeysRepo: ObjectKeyStateService,
    private nzMessageService: NzMessageService
  ) {}

  uiTypes: UiType[] = [];
  postObject:any=null;
  editCacheUiType: { [key: number]: { edit: boolean; data: UiType } } = {};

  form = new FormGroup({});
  options: FormlyFormOptions = {};
  model: any;
  fields: FormlyFieldConfig[] = [];
  fieldsDummy: FormlyFieldConfig[] = [
    {
      key: 'name',
      type: 'input',
      props: {
        label: 'Name',
        placeholder: 'Enter name of UI Type',
        required: true,
      },
    },
  ];

  ngOnInit(): void {
    this.uiTypesRepo.store.uiTypesAll$.subscribe((data) => {
      this.uiTypes = data;
    });
    this.objectKeysRepo.store.objectKeysAll$.subscribe((data) => {
      // this.objectKeys = data;
      const fields = data.map((field: ObjectKey) => {
        const uiType = this.uiTypes.find((meta) => meta.id === field.uiTypeId);
        return {
          key: field.keyName,
          type: uiType?.name || 'textarea',
          props: { 
            label: field.label,
            description: field.description,
            required: true
          },
        } as any;
      });
      this.model = {};
      console.log({ fields });
      this.fields = this.mapFields(fields);
    });
  }

  onSubmit(model: any) {
    if (this.form.valid) {
      this.postObject = JSON.parse(JSON.stringify(this.model))
    }else{
      this.postObject = null;
    }
  }

  /**
   * Adjust the JSON fields loaded from the server.
   */
  mapFields(fields: FormlyFieldConfig[]) {
    return fields.map((f) => {
      // Bind an observable to `color` field.
      if (f.key === 'color') {
        f.type = 'radio';
        //f.props.options = this.userService.getColors();
      }

      return f;
    });
  }

  ngOnDestroy(): void {
      this.fields =[]
      this.model ={}
  }
}
