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

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    }),
    provideNzIcons(),
    provideNzI18n(en_US),
    importProvidersFrom(FormsModule),
    importProvidersFrom(HttpClientModule),
    provideAnimations(),
    defaultStoreProvider,
    importProvidersFrom(ReactiveFormsModule),
    importProvidersFrom(FormlyModule.forRoot({
      validationMessages: [{ name: 'required', message: 'This field is required' }],
    })),    
    importProvidersFrom(FormlyNgZorroAntdModule),
  ],
};
