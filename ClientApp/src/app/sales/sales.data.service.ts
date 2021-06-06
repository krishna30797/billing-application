import { Component, Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Sales } from 'src/app/Model/Sales';
@Injectable()
export class SalesDataService {
    Sales: Sales[];
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {

  }

  GetSalesByDate(fromDate,toDate) {
    let result = this.http.get<Sales[]>(this.baseUrl + `sales/GetSalesByDate?fromDate=${fromDate}&toDate=${toDate}`).toPromise();
    return result;
  }

}