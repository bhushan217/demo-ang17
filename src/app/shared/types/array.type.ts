import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FieldArrayType, FormlyModule } from '@ngx-formly/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'formly-array-type',
  standalone:true,
  imports:[CommonModule, FormlyModule, NzButtonModule, NzIconModule],
  template: `
    <div class="mb-3">
      <legend *ngIf="props.label">{{ props.label }}</legend>
      <p *ngIf="props.description">{{ props.description }}</p>
      <div class="d-flex flex-row-reverse">
        <button nz-button nzType="primary" type="button" (click)="add()">
        <span nz-icon nzType="plus"></span>{{ 'Add '+ props.label  }}
        </button>
      </div>

      <div class="alert alert-danger" role="alert" *ngIf="showError && formControl.errors">
        <formly-validation-message [field]="field"></formly-validation-message>
      </div>

      <div *ngFor="let field of field.fieldGroup; let i = index" class="row align-items-start">
        <formly-field class="col" [field]="field"></formly-field>
        <div *ngIf="field.props?.['removable'] !== false" class="col-2 text-right">
          <button nz-button nzType="default" type="button" (click)="remove(i)">
          <span nz-icon nzType="delete" nzTheme="outline">{{i}}</span>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ArrayTypeComponent extends FieldArrayType {}