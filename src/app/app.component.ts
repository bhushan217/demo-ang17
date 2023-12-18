import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { SvgIconComponent } from "./shared/components/icons/svg-icon/svg-icon.component";
import { HomePageComponent } from './pages/home-page/home-page.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { FormsModule } from '@angular/forms';
import { routes } from './app.routes';

export type ThemeType = 'default' | 'dark' | ''

type NavDataType = {
  path: string;
  title: string;
};

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass'],
    imports: [
      CommonModule, RouterOutlet, SvgIconComponent, RouterModule, 
      NzLayoutModule, NzMenuModule, NzIconModule, NzEmptyModule, 
      HomePageComponent, WelcomeComponent, NzSwitchModule, FormsModule
  ],
})
export class AppComponent implements OnInit{
  title = 'demo-ang17'
  isCollapsed = false;
  darkModeOn = false;
  currentTheme: ThemeType = '';
  previousTheme: ThemeType = '';

  navTabsData: NavDataType[] = [];
  
  constructor(){
    this.darkModeOn = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  }

  private getCurrentTheme(): ThemeType {
    return this.darkModeOn ? 'dark' : 'default';
  }

  ngOnInit(): void {
    this.loadTheme(true);
    this.navTabsData = routes.filter(r => !!r.title).map(r => ({path: r.path, title: r.title} as NavDataType))
  }

  private loadCss(href: string, id: string): Promise<Event> {
    return new Promise((resolve, reject) => {
      const style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href = href;
      style.id = id;
      style.onload = resolve;
      style.onerror = reject;
      document.head.append(style);
    });
  }

  private removeUnusedTheme(theme: ThemeType): void {
    document.documentElement.classList.remove(theme);
    const removedThemeStyle = document.getElementById(theme);
    if (removedThemeStyle) {
      document.head.removeChild(removedThemeStyle);
      // document.documentElement.classList.toggle('dark')
    }
  }
  
  loadTheme(firstLoad = true): Promise<Event> {
    console.log({currentThemeFlag: this.darkModeOn})
    const theme: ThemeType = this.getCurrentTheme();
    if (firstLoad) {
      document.documentElement.classList.add(theme);
    }
    return this.loadCss(`${theme}.css`, theme).then(
      _res => {
        if (!firstLoad) {
          document.documentElement.classList.add(theme);
        }
        this.previousTheme && this.removeUnusedTheme(this.previousTheme);
        this.resolve2(theme);
        return _res;
      },
      err => this.onError(err)
    );
  }
  
 resolve2 (theme: ThemeType)  {
   console.debug('resolve2:', {theme});
   this.previousTheme = this.currentTheme;
   this.currentTheme = theme;
}
onError(err: any): any {
   console.debug('onError:',{err});
   return err;
}
}




