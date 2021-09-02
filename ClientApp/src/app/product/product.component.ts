import { Component, Inject, NgModule, OnInit } from '@angular/core';
import { Product, Units } from '../Model/Product';
import { ProductBusiness } from './product.data.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PopUpComponent } from '../common/popup/popup.component';
import { DropDownOption } from '../common/Model/common-model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [ProductBusiness]
})
export class ProductComponent implements OnInit {
  public Product: Product[];
  ProductTemp: Product[];
  productForm: FormGroup;;
  searchText;
  UnitsDropDown:DropDownOption[];
  UnitsEnum:typeof Units=Units;
  displayedColumns: string[] = ['productCode', 'productDescription', 'price', 'units', 'action'];
  constructor(private fb: FormBuilder, private productBusiness: ProductBusiness,
    public dialog: MatDialog
  ) {

  }
  ngOnInit(): void {
    this.UnitsDropDown=this.UIDropDownMapper(Units);
    this.productForm = this.fb.group({
      id: 0,
      productCode: ['', Validators.required],
      productDescription: ['', Validators.required],
      price: 0,
      units: ['', Validators.required]
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
  UIDropDownMapper(data: typeof Units): DropDownOption[] {
    let enumArr = [];
    for (const [propertKey, propertyValue] of Object.entries(data)) {
      if (!Number.isNaN(Number(propertKey))) {
        continue;
      }
      enumArr.push({ id: propertyValue, value: propertKey })
    }
    const options: DropDownOption[] = enumArr.map(a => {
      const option: DropDownOption = {
        id: a.id,
        value:a.id,
        viewValue:a.value
      };
      return option;
    });
    return options;
  }
  AddProduct() {
    let product: Product = {
      id: this.productForm.value.id,
      productCode: this.productForm.value.productCode,
      productDescription: this.productForm.value.productDescription,
      price: this.productForm.value.price,
      units: this.productForm.value.units
    }
    this.productBusiness.CreateProduct(product).then(r => {
      this.Product = r;
      this.openDialog("Saved Successfully");
      this.productForm.reset();
      this.productForm.patchValue({
        id: 0,
        price: 0
      })
    }
    ).catch(e =>
      this.openDialog(JSON.stringify(e.error.text))
    );
  }
  EditProduct() {
    let product: Product = {
      id: this.productForm.value.id,
      productCode: this.productForm.value.productCode,
      productDescription: this.productForm.value.productDescription,
      price: this.productForm.value.price,
      units: this.productForm.value.units
    }
    this.productBusiness.EditProduct(product).then(r => {
      this.Product = r;
      this.openDialog("Saved Successfully");
      this.productForm.reset();
      this.productForm.patchValue({
        id: 0,
        price: 0
      })

    }
    ).catch(e =>
      this.openDialog(JSON.stringify(e.error.text))
    );
  }
  DeleteProduct(id) {
    this.productBusiness.DeleteProduct(id).then(r => {
      this.Product = r;
      this.productForm.reset()
      this.openDialog("Deleted Successfully")
    }
    ).catch(e =>
      this.openDialog(JSON.stringify(e))
    );
  }
  openDialog(alert): void {
    const dialogRef = this.dialog.open(PopUpComponent, {
      width: '30em',
      data: { name: alert }
    });
  }

}
