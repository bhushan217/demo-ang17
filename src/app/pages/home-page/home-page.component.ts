import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UiTypeStateService } from '../../store/ui-type/ui-type.state-service';
import { ObjectKeyStateService } from '../../store/object-key/object-key.state-service';
import { UiType } from '@app/store/ui-type/ui-type.model';
import { ObjectKey } from '@app/store/object-key/object-key.model';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  FormlyFieldConfig,
  FormlyFormOptions,
  FormlyModule,
} from '@ngx-formly/core';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [FormlyModule, CommonModule, ReactiveFormsModule, NzFormModule, NzButtonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.sass',
})
export class HomePageComponent implements OnInit {
  @Output() remove = new EventEmitter();

  constructor(
    private uiTypesRepo: UiTypeStateService,
    private objectKeysRepo: ObjectKeyStateService
  ) {}

  uiTypes: UiType[] = [];
  objectKeys: ObjectKey[] = [];
  postObject:any=null;

  form = new FormGroup({});
  options: FormlyFormOptions = {};
  model: any;
  fields: FormlyFieldConfig[] = [];
  fieldsDuumy: FormlyFieldConfig[] = [
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
      this.objectKeys = data;
      const fields = data.map((field: ObjectKey) => {
        const uiType = this.uiTypes.find((meta) => meta.id === field.uiTypeId);
        return {
          key: field.keyName,
          type: uiType?.name || 'textarea',
          props: { 
            label: field.keyName,
            placeholder: 'Default Placeholder',
            description: 'Default Description',
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
}
