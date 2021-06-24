export interface NavItem {
    displayName: string;
    disabled?: boolean;
    iconName: string;
    route?: string;
    children?: NavItem[];
  }
  //https://stackblitz.com/edit/dynamic-nested-sidenav-menu?file=app%2Fnav.service.ts