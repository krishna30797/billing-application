import { Component, Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../Model/Product';
@Injectable()
export class ProductBusiness{
    public Product: Product[];
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
  
      }

      GetAllProducts()
      {
        let result= this.http.get<Product[]>(this.baseUrl + 'product/GetAllProducts').toPromise();
          return result;
      }
      CreateProduct(product :Product)
      {
        let result= this.http.post<Product[]>(this.baseUrl + 'product/create',product).toPromise();
        return result;
      }
      EditProduct(product :Product)
      {
        let result= this.http.post<Product[]>(this.baseUrl + 'product/edit',product).toPromise();
        return result;
      }
      DeleteProduct(id :number)
      {
        let result= this.http.post<Product[]>(this.baseUrl + 'product/delete/'+id,'').toPromise();
        return result;
      }
}