import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavItem } from './nav-items';
import { NavService } from './nav-service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements AfterViewInit {

  @ViewChild('appDrawer', { static: false }) appDrawer: ElementRef;
  navItems: NavItem[] = [
    {
      displayName: 'Invoice',
      iconName: 'receipt',
      route: '',
      children: [
        {
          displayName: 'Create Invoice',
          iconName: 'create',
          route: '/create-invoice',
        },
        {
          displayName: 'Invoice Details',
          iconName: 'table_chart',
          route: '/invoice-details',
        }]    
    },
    {
      displayName: 'Sales',
        iconName: 'pie_chart',
        route: '/sales',      
    },
  {
    displayName: 'Product',
      iconName: 'store',
      route: '',
      children: [
        {
          displayName: 'Create Product',
          iconName: 'create',
          route: '/product',
        }]
  }]
  constructor(public navService: NavService) {
  }

  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }
}
