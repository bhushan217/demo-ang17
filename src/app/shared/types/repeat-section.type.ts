import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FieldArrayType, FormlyModule } from '@ngx-formly/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
@Component({
selector: 'formly-field-repeat',
standalone:true,
imports: [FormlyModule, CommonModule, NzButtonModule, NzIconModule],
  template: `
    <div class="mb-3">
      <legend *ngIf="props.label">{{ props.label }}</legend>
      <p *ngIf="props.description">{{ props.description }}</p>
      <div nzStatus="error" role="alert" *ngIf="showError && formControl.errors">
        <formly-validation-message [field]="field"></formly-validation-message>
      </div>
      <div
        *ngFor="let field of field.fieldGroup; let i = index"
        class="row align-items-baseline"
      >
        <formly-field class="col" [field]="field"></formly-field>
        <div class="col-1 d-flex align-items-center">
          <button nz-button nzType="default" type="button" nzButton (click)="remove(i)">
          <span nz-icon nzType="delete" nzTheme="outline" title="Remove at index {{i}}"></span>
          </button>
        </div>
      </div>
      <div style="margin:30px 0;">
        <button nz-button nzType="primary" type="button" (click)="add()">
        <span nz-icon nzType="plus"></span>{{ 'Add '+ props.label + '['+(field.fieldGroup?.length||1)+']'  }}
        </button>
      </div>
    </div>
  `,
})
export class RepeatTypeComponent extends FieldArrayType {}
