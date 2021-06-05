import { Component, Inject, Injectable, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, finalize, switchMap, take, tap } from 'rxjs/operators';
import { Product, ProductSearch } from 'src/app/Model/Product';
import { InvoiceDetails, ProductInvoice } from 'src/app/Model/Invoice';
import { CreateInvoiceDataService } from './create-invoice.data.service';
import { DatePipe } from '@angular/common'
@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.css'],
  providers: [CreateInvoiceDataService]
})

export class CreateInvoiceComponent implements OnInit {
  displayedColumns: string[] = ['productCode', 'productDescription', 'price', 'quantity', 'totalPrice', 'action'];
  invoiceDetails: InvoiceDetails;
  invoiceNumber: number;
  invoiceStartDate = new Date();
  NetTotal: number = 0;
  FreightCharges: number = 0
  LoadingCharges: number = 0
  totalPrice: number = 0
  invoiceDescription:string
  invoiceDate:string = this.datePipe.transform(this.invoiceStartDate, 'dd-MM-yyyy')
  obsArray: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public data: Observable<ProductInvoice[]> = this.obsArray.asObservable();
  public masterData: ProductInvoice[] = []
  productForm: FormGroup;
  invoiceDetailsFrom: FormGroup;
  ProductData: Product[];
  productSearchData: ProductSearch[];
  isLoading: boolean = false;
  keyword = "name"
  productSelected = new FormControl()
  constructor(private fb: FormBuilder, private datePipe: DatePipe,
    private CreateInvoiceDataService: CreateInvoiceDataService) {
  }

  ngOnInit(): void {
    this.GetInvoiceNumber();
    this.invoiceDetailsFrom = this.fb.group({

      invoiceId: this.invoiceNumber,
      invoiceDescription: '',
      invoiceDate: this.invoiceStartDate,
      freightCharges: '',
      loadingCharges: '',
      totalPrice: 0,
      netTotal: 0
    });
    this.productForm = this.fb.group({
      productFilter: '',
      productId: 0,
      productCode: ['', Validators.required],
      productDescription: ['', Validators.required],
      price: '',
      quantity: ''
    })

    this.data.subscribe(val => {
      this.totalPrice = +val.reduce(function (accumulator, item) {
        return accumulator + item.quantity * item.price;
      }, 0).toFixed(2);
      this.NetTotal = this.totalPrice + this.FreightCharges + this.LoadingCharges
      this.invoiceDetailsFrom.patchValue({
        freightCharges: this.FreightCharges,
        loadingCharges: this.LoadingCharges,
        totalPrice: this.totalPrice,
        netTotal: this.NetTotal
      })
    })
    this.invoiceDetailsFrom.valueChanges.subscribe(val => {
      this.FreightCharges = val.freightCharges
      this.LoadingCharges = val.loadingCharges
      this.NetTotal = this.totalPrice + this.FreightCharges + this.LoadingCharges;
      this.invoiceDescription = val.invoiceDescription;
      this.invoiceDate = this.datePipe.transform(val.invoiceDate, 'yyyy-MM-dd');
    })
    this.productForm.get('productFilter').valueChanges
      .pipe(
        debounceTime(300),
        tap(() => this.isLoading = true),
        switchMap(value => this.CreateInvoiceDataService.GetProductSearch(value)
          .pipe(
            finalize(() => this.isLoading = false),
          )
        )
      )
      .subscribe(p => {
        this.productSearchData = p;
      })
    this.getProduct();
  }

  async GetInvoiceNumber() {
    this.CreateInvoiceDataService.GetNextInvoiceNumber().then(r => {
      this.invoiceNumber = r;
      this.productForm.patchValue({
        invoiceId: this.invoiceNumber
      })
    });
  }
  async getProduct() {
    this.ProductData = await this.CreateInvoiceDataService.GetAllProductspromise();
  }
  selectEvent(e: ProductSearch) {
    let productIndex = this.ProductData.findIndex(p => p.id == e.id)

    this.productForm.patchValue({
      productFilter: '',
      invoiceId: this.invoiceNumber,
      productId: this.ProductData[productIndex].id,
      productCode: this.ProductData[productIndex].productCode,
      productDescription: this.ProductData[productIndex].productDescription,
      price: this.ProductData[productIndex].price,
      quantity: 0
    })
  }

  onAction() {
    let product: ProductInvoice = {
      invoiceId: this.invoiceNumber,
      productId: this.productForm.value.productId,
      productCode: this.productForm.value.productCode,
      productDescription: this.productForm.value.productDescription,
      price: this.productForm.value.price,
      quantity: this.productForm.value.quantity,
    }
    let tempProduct = [...this.masterData];
    tempProduct.push(product);
    this.masterData = [...tempProduct];
    this.addMasterDatatoObservable(this.masterData);
    this.productForm.reset();
    this.productForm.patchValue({
      invoiceId: this.invoiceNumber,
      productId: 0,
      price: '',
      quantity:''
    })
  }
  patchEditForm(product: ProductInvoice) {
    var removeIndex = this.masterData.map(function (item) { return item.productId; }).indexOf(product.productId);
    let tempProduct = [...this.masterData];
    tempProduct.splice(removeIndex, 1)
    this.masterData = [...tempProduct];
    this.addMasterDatatoObservable(this.masterData);
    this.productForm.patchValue(
      product
    )
  }
  DeleteProduct(productId) {
    var removeIndex = this.masterData.map(function (item) { return item.productId; }).indexOf(productId);
    let tempProduct = [...this.masterData];
    tempProduct.splice(removeIndex, 1)
    this.masterData = [...tempProduct];
    this.addMasterDatatoObservable(this.masterData);

  }
  OnSave(saveAndPrint: number) {
    if (saveAndPrint == 0) {
     this.SaveInvoive()
    }
    else {
      this.SaveInvoive();
    }
  }
  SaveInvoive() {
    let invoice: InvoiceDetails =
    {
      invoiceId: 0,
      invoiceDescription: this.invoiceDetailsFrom.get('invoiceDescription').value,
      invoiceDate: this.invoiceDetailsFrom.get('invoiceDate').value,
      freightCharges: (this.FreightCharges),
      loadingCharges: (this.LoadingCharges),
      netTotal: (this.NetTotal),
      totalPrice: (this.totalPrice),
      productInvoice: [...this.masterData]
    };

    this.CreateInvoiceDataService.CreateInvoice(invoice).
      then(r => {
        if (r) {
          alert("Successfully Saved");
          this.GetInvoiceNumber();
          this.invoiceDetailsFrom.patchValue({
            invoiceId: this.invoiceNumber,
            invoiceDescription: '',
            invoiceDate: this.invoiceStartDate,
            freightCharges: 0,
            loadingCharges: 0,
            totalPrice: 0,
            netTotal: 0
          });
          this.productForm.patchValue({
            productFilter: '',
            productId: 0,
            productCode: '',
            productDescription: '',
            price: '',
            quantity: ''
          })
          this.masterData = [];
        }
        else {
          alert("Error in Saving Invoice");
        }

      }
      ).catch(r =>
        alert(r))
  }

  addMasterDatatoObservable(data) {
    this.data.pipe(take(1)).subscribe(val => {
      this.obsArray.next(data);
    })
  }
}
