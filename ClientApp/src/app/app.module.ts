import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { ProductComponent } from '../app/product/product.component'
import { MatButtonModule } from '@angular/material/button'
import { MatButtonToggleModule } from '@angular/material/button-toggle'

import { NgxPrintModule } from 'ngx-print';
import { DateAdapter, MatAutocompleteModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatNativeDateModule, MatProgressSpinnerModule, MatSidenavModule, MatToolbarModule } from '@angular/material';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { AppRoutingModule } from './app-routing.module';
import { InvoiceDetailsComponent } from './invoice/invoice-details/invoice-details.component';
import { CreateInvoiceComponent } from './invoice/create-invoice/create-invoice.component';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { PopUpComponent } from './common/popup/popup.component';
import { SalesComponent } from './sales/sales.component';
import { NavService } from './nav-menu/nav-service';
import { MenuListItemComponent } from './menu-list/menu-list-item.component';
@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    ProductComponent,
    CreateInvoiceComponent,
    InvoiceDetailsComponent,
    SalesComponent,
    PopUpComponent,
    MenuListItemComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    NgxPrintModule,
    MatAutocompleteModule,
    Ng2SearchPipeModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    AppRoutingModule
  ],
  providers: [DatePipe,NavService],
  bootstrap: [AppComponent],
  entryComponents: [PopUpComponent],
})
export class AppModule {
  constructor(private dateAdapter: DateAdapter<Date>) {
    dateAdapter.setLocale("en-in"); // DD/MM/YYYY
  }
}
