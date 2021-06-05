import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { ProductComponent }from '../app/product/product.component'
import {MatButtonModule } from '@angular/material/button'
import {MatButtonToggleModule} from '@angular/material/button-toggle'

import {NgxPrintModule} from 'ngx-print';
import { DateAdapter, MatAutocompleteModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatNativeDateModule, MatProgressSpinnerModule } from '@angular/material';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';
import { AppRoutingModule } from './app-routing.module';
import { InvoiceDetailsComponent } from './invoice/invoice-details/invoice-details.component';
import { CreateInvoiceComponent } from './invoice/create-invoice/create-invoice.component';
import { CommonModule, DatePipe } from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    ProductComponent,
    CreateInvoiceComponent,
    InvoiceDetailsComponent
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
RouterModule.forRoot([
  { path: '', component: InvoiceDetailsComponent, pathMatch: 'full' },
  { path: 'product', component: ProductComponent },
  { path: 'create-invoice', component: CreateInvoiceComponent },
  { path: 'invoice-details', component: InvoiceDetailsComponent }]
)

  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private dateAdapter: DateAdapter<Date>) {
    dateAdapter.setLocale("en-in"); // DD/MM/YYYY
  }
 }
