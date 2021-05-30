import { Component, Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product,ProductSearch } from 'src/app/Model/Product';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { InvoiceDetails, ProductInvoice } from 'src/app/Model/Invoice';
@Injectable()
export class InvoiceDetailsDataService {
    invoiceDetails: InvoiceDetails[];
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {

  }

  GetAllInvoice() {
    let result = this.http.get<InvoiceDetails[]>(this.baseUrl + 'invoice/GetAllInvoiceDetails').toPromise();
    return result;
  }
}