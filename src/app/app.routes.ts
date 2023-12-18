import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { UiTypeComponent } from './pages/ui-type/ui-type.component';
import { ObjectKeyComponent } from './pages/object-key/object-key.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  { path: 'welcome', title: 'Demo', loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES) },
  { path: 'ui-type', title: 'UI Type', component: UiTypeComponent },
  { path: 'object-key', title: 'Object Key', component: ObjectKeyComponent },
  { path: 'preview-form', title: 'Preview', component: HomePageComponent },
];
