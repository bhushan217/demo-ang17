import { ApplicationConfig, isDevMode, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
// import { KeyValueServiceService } from './services/key-value.service.service';
import { provideHttpClient, withFetch, HttpClientModule } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
import { provideNzIcons } from './icons-provider';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { defaultStoreProvider } from '@state-adapt/angular';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyNgZorroAntdModule } from '@ngx-formly/ng-zorro-antd';
import { RepeatTypeComponent } from './shared/types/repeat-section.type';
import { FormlyFieldDatetime } from './shared/types/date.type';
import { ObjectTypeComponent } from './shared/types/object.type';
import { ArrayTypeComponent } from './shared/types/array.type';
import { NzConfig, provideNzConfig } from 'ng-zorro-antd/core/config';

const ngZorroConfig: NzConfig = {
  message: { nzTop: 120 },
  notification: { nzTop: 240 },
  theme: {
    primaryColor: '#c65521'
  }
};
registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    }),
    provideNzI18n(en_US),
    importProvidersFrom(FormsModule),
    importProvidersFrom(HttpClientModule),
    provideAnimations(),
    provideRouter(routes),
    defaultStoreProvider,
    provideNzConfig(ngZorroConfig),  
    provideNzIcons(),
    importProvidersFrom(ReactiveFormsModule),
    importProvidersFrom(FormlyNgZorroAntdModule),
    importProvidersFrom(FormlyModule.forChild({
      validationMessages: [{ name: 'required', message: 'This field is required' }],
      types:[
        {name:'repeat', component: RepeatTypeComponent, wrappers: ['form-field']},
        {name:'array', component: ArrayTypeComponent, wrappers: ['form-field']},
        {name:'object', component: ObjectTypeComponent, wrappers: ['form-field']},
        {name:'date', component: FormlyFieldDatetime, wrappers: ['form-field']},
      ]
    })),  
  ],
};
