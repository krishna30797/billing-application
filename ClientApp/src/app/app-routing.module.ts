import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateInvoiceComponent } from './invoice/create-invoice/create-invoice.component';
import { InvoiceDetailsComponent } from './invoice/invoice-details/invoice-details.component';
import { ProductComponent } from './product/product.component';


const routes: Routes = [
  { path: '', component: InvoiceDetailsComponent, pathMatch: 'full' },
  { path: 'product', component: ProductComponent },
  { path: 'create-invoice', component: CreateInvoiceComponent },
  { path: 'invoice-details', component: InvoiceDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }