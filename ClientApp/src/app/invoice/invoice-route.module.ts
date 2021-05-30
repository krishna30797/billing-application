import { HttpClient } from "@angular/common/http";
import { Inject } from "@angular/core";
import { ProductInvoice } from "src/app/Model/Invoice";

export class InvoiceRouteModule{

    public ProductInvoice: ProductInvoice[];
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {

  }
}