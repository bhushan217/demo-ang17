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

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass'],
    imports: [
      CommonModule, RouterOutlet, SvgIconComponent, RouterModule, 
      NzLayoutModule, NzMenuModule, NzIconModule, NzEmptyModule, 
      HomePageComponent, WelcomeComponent,
  ],
})
export class AppComponent implements OnInit{
  title = 'demo-ang17'
  isCollapsed = false;
  
  constructor(){}

  ngOnInit(): void {
   
  }
}
