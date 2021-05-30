import { Component, Inject, NgModule, OnInit } from '@angular/core';
import { Product } from '../Model/Product';
import { ProductBusiness } from './product.data.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls:['./product.component.css'],
  providers: [ProductBusiness]
})
export class ProductComponent implements OnInit {
  public Product: Product[];
  ProductTemp: Product[];
  productForm: FormGroup;;
  searchText;
  displayedColumns: string[] = ['productCode', 'productDescription', 'price', 'action'];
  constructor(private fb: FormBuilder, private productBusiness: ProductBusiness,
    ) {

  }
  ngOnInit(): void {
    this.productForm = this.fb.group({
      id: 0,
      productCode: ['', Validators.required],
      productDescription: ['', Validators.required],
      price: ''
    })
    this.GetAllProducts();

  }
  GetAllProducts() {
    this.productBusiness.GetAllProducts().then(r => { 
      this.Product = r 
    })
  }
  onAction() {
    if (this.productForm.value.id == 0)
        this.AddProduct();
    else
      this.EditProduct()
  }
  patchEditForm(product) {
    this.productForm.patchValue(
      product
    )
  }
  AddProduct() {
    let product: Product = {
      id: this.productForm.value.id,
      productCode: this.productForm.value.productCode,
      productDescription: this.productForm.value.productDescription,
      price: this.productForm.value.price,
    }
    this.productBusiness.CreateProduct(product).then(r => {
      this.Product = r;
      this.productForm.reset();
      this.productForm.patchValue({
        id:0,
        price: 0
      })
    }
    ).catch(e =>
      alert(JSON.stringify(e))
    );
  }
  EditProduct() {
    let product: Product = {
      id: this.productForm.value.id,
      productCode: this.productForm.value.productCode,
      productDescription: this.productForm.value.productDescription,
      price: this.productForm.value.price,
    }
    this.productBusiness.EditProduct(product).then(r => {
      this.Product = r;
      this.productForm.reset();
      this.productForm.patchValue({
        id:0,
        price: 0
      })
    }
    ).catch(e =>
      alert(JSON.stringify(e))
    );
  }
  DeleteProduct(id) {
    this.productBusiness.DeleteProduct(id).then(r => {
      this.Product = r;
      this.productForm.reset()
    }
    ).catch(e =>
      alert(JSON.stringify(e))
    );
  }

}
