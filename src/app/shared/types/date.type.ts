import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  Type,
  ViewEncapsulation,
  ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  FieldType,
  FieldTypeConfig,
  FormlyFieldConfig,
  FormlyModule,
} from '@ngx-formly/core';
import {
  FormlyFieldProps,
  FormlyNzFormFieldModule,
} from '@ngx-formly/ng-zorro-antd/form-field';
import {
  NzDatePickerComponent,
  NzDatePickerModule,
} from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';

interface DatetimeProps extends FormlyFieldProps {
  presentation?:
    | 'date'
    | 'date-time'
    | 'month'
    | 'month-year'
    | 'time'
    | 'time-date'
    | 'year';
  locale?: any;
  cancelText?: string;
  doneText?: string;
  dayValues?: number | number[] | string | undefined;
  hourValues?: number | number[] | string | undefined;
  minuteValues?: number | number[] | string | undefined;
  monthValues?: number | number[] | string | undefined;
  yearValues?: number | number[] | string | undefined;
  minDate?: string | undefined;
  maxDate?: string | undefined;
  displayFormat?: string;
}

export interface FormlyDatetimeFieldConfig
  extends FormlyFieldConfig<DatetimeProps> {
  type: 'datetime' | Type<FormlyFieldDatetime>;
}

@Component({
  selector: 'formly-field-nz-datetime',
  standalone: true,
  imports: [
    CommonModule,
    FormlyModule,
    FormlyNzFormFieldModule,
    NzDatePickerModule,
    NzFormModule,
    ReactiveFormsModule,
  ],
  template: `
    <nz-form-control>
      <nz-date-picker
        [formlyAttributes]="field"
        [formControl]="formControl"
      ></nz-date-picker
    ></nz-form-control>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // styleUrls: ['./dattime.type.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormlyFieldDatetime extends FieldType<
  FieldTypeConfig<DatetimeProps>
> {
  @ViewChild(NzDatePickerComponent) datetime!: NzDatePickerComponent;
  isOpen = false;

  override defaultOptions = {
    props: {
      presentation: 'month-year' as const,
    },
  };

  displayFormat(): string {
    if (this.props.displayFormat) {
      return this.props.displayFormat;
    }

    switch (this.props.presentation) {
      case 'date-time':
      case 'time-date':
        return 'short';
      case 'time':
        return 'shortTime';
      case 'month':
        return 'MMMM';
      case 'month-year':
        return 'MMMM, y';
      case 'year':
        return 'y';
      case 'date':
        return 'mediumDate';
    }
    return 'MM/DD/YYYY';
  }

  confirm() {
    this.datetime?.onResultOk();
    this.close();
  }

  reset() {
    // this.datetime.reset();
    this.close();
  }

  close() {
    this.isOpen = false;
    this.formControl.markAsTouched();
  }
}
