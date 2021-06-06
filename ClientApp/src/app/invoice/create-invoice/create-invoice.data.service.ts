import { Component, Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product,ProductSearch } from 'src/app/Model/Product';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { InvoiceDetails, ProductInvoice } from 'src/app/Model/Invoice';
@Injectable()
export class CreateInvoiceDataService {
  public ProductInvoice: ProductInvoice[];
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {

  }

  GetAllProducts(state?: any): Observable<any[]> {
    return this.http.get<Product[]>(this.baseUrl + 'product/GetAllProducts').pipe();

  }
  async GetAllProductspromise() {
    let result = await this.http.get<Product[]>(this.baseUrl + 'product/GetAllProducts').toPromise();
    return result;
  }
  GetProductSearch(searchText: string):Observable<ProductSearch[]> {
    let result = this.http.get<Product[]>(this.baseUrl + 'product/GetProductBySearch?searchParam=' + searchText)
    return result.pipe(
      map(product=> product.map(({id,productCode,productDescription})=> ({
        id: id,
        name: productCode + ' - ' + productDescription
      }))
    ));
  }

  async GetNextInvoiceNumber() {
    return await this.http.get<number>(this.baseUrl + 'invoice/GetNextInvoiceNumber').toPromise();
  }
  CreateInvoice(invoice: InvoiceDetails) {
    let result = this.http.post<InvoiceDetails[]>(this.baseUrl + 'invoice/CreateInvoice', invoice).toPromise();
    return result;
  }
  UpdateInvoice(invoice: InvoiceDetails) {
    let result = this.http.post<InvoiceDetails[]>(this.baseUrl + 'invoice/EditInvoice', invoice).toPromise();
    return result;
  }
  async GetInvoiceById(invoiceId:number)
  {
    let result = this.http.get<InvoiceDetails>(this.baseUrl + `invoice/GetInvoiceById/${invoiceId}`).toPromise();
    return result;
  }
}