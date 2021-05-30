import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CreateInvoiceComponent } from './invoice/create-invoice/create-invoice.component';
import { ProductComponent } from './product/product.component';


const routes: Routes = [
        { path: '', component: HomeComponent, pathMatch: 'full' },
        { path: 'product', component: ProductComponent },
        { path: 'create-invoice', component: CreateInvoiceComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }