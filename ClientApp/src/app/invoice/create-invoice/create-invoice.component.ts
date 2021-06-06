import { Component, Inject, Injectable, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { debounceTime, finalize, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { Product, ProductSearch } from 'src/app/Model/Product';
import { InvoiceDetails, ProductInvoice } from 'src/app/Model/Invoice';
import { CreateInvoiceDataService } from './create-invoice.data.service';
import { DatePipe } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PopUpComponent } from 'src/app/common/popup/popup.component';
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
  invoiceDescription: string
  invoiceDate: string = this.datePipe.transform(this.invoiceStartDate, 'dd-MM-yyyy')
  obsArray: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public data: Observable<ProductInvoice[]> = this.obsArray.asObservable();
  destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  public masterData: ProductInvoice[] = []
  productForm: FormGroup;
  invoiceDetailsFrom: FormGroup;
  ProductData: Product[];
  productSearchData: ProductSearch[];
  isLoading: boolean = false;
  keyword = "name"
  productSelected = new FormControl();
  isEditInvoice: boolean = false;
  constructor(private fb: FormBuilder, private datePipe: DatePipe,
    private CreateInvoiceDataService: CreateInvoiceDataService
    , private router: Router, private route: ActivatedRoute,
    public dialog:MatDialog) {
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(params => {
      this.invoiceNumber = (+params['invoiceId']);
    });
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
      productInvoiceId:0,
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
      this.invoiceDate = this.datePipe.transform(val.invoiceDate, 'dd-MM-yyyy');
    })
    if (this.invoiceNumber == undefined || this.invoiceNumber.toString() == 'NaN') {
      this.GetInvoiceNumber();
    }
    else {
      this.isEditInvoice = true;
      this.EditInvoice(this.invoiceNumber);
    }
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
  async EditInvoice(invoiceId) {
    let invoiceData = await this.CreateInvoiceDataService.GetInvoiceById(invoiceId);
    this.masterData = [...invoiceData.productInvoice];
    this.addMasterDatatoObservable(this.masterData);
    this.invoiceDetailsFrom.patchValue({
      invoiceId: invoiceData.invoiceId,
      invoiceDescription: invoiceData.invoiceDescription,
      invoiceDate: invoiceData.invoiceDate,
      freightCharges: invoiceData.freightCharges,
      loadingCharges: invoiceData.loadingCharges,
      totalPrice: invoiceData.totalPrice,
      netTotal: invoiceData.netTotal
    });
  }
  async GetInvoiceNumber() {
    this.CreateInvoiceDataService.GetNextInvoiceNumber().then(r => {
      this.invoiceNumber = r;
      this.invoiceDetailsFrom.patchValue({
        invoiceId: this.invoiceNumber
      });
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
      productInvoiceId:0,
      productId: this.ProductData[productIndex].id,
      productCode: this.ProductData[productIndex].productCode,
      productDescription: this.ProductData[productIndex].productDescription,
      price: this.ProductData[productIndex].price,
      quantity: 0
    })
  }

  onAddProductAction() {
    let product: ProductInvoice = {
      invoiceId: this.invoiceNumber,
      productInvoiceId:this.productForm.value.productInvoiceId,
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
      productInvoiceId:0,
      price: '',
      quantity: ''
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
    let invoice: InvoiceDetails =
    {
      invoiceId: 0,
      invoiceDescription: this.invoiceDetailsFrom.get('invoiceDescription').value,
      invoiceDate: this.datePipe.transform(this.invoiceDetailsFrom.get('invoiceDate').value, 'yyyy-MM-dd'),
      freightCharges: (this.FreightCharges),
      loadingCharges: (this.LoadingCharges),
      netTotal: (this.NetTotal),
      totalPrice: (this.totalPrice),
      productInvoice: [...this.masterData]
    };
    if(this.isEditInvoice)
    this.UpdateInvoice(invoice);
    else
      this.CreateInvoice(invoice);
  }
  CreateInvoice(invoice) {
    this.CreateInvoiceDataService.CreateInvoice(invoice).
      then(r => {
        if (r) {
          this.openDialog("Saved Successfully");
          this.GetInvoiceNumber();
          this.ClearInvoiceFrom();
        }
        else {
          this.openDialog("Error in Saving Invoice");
        }

      }
      ).catch(r =>
        this.openDialog(r))
  }
  UpdateInvoice(invoice:InvoiceDetails) {
    invoice.invoiceId=this.invoiceNumber;
    this.CreateInvoiceDataService.UpdateInvoice(invoice).
      then(r => {
        if (r) {
          this.openDialog("Saved Successfully");
          this.GetInvoiceNumber();
          this.ClearInvoiceFrom();
        }
        else {
          this.openDialog("Error in Saving Invoice");
        }

      }
      ).catch(r =>
        this.openDialog(r))
  }
  ClearInvoiceFrom() {
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
      productInvoiceId:0,
      productId: 0,
      productCode: '',
      productDescription: '',
      price: '',
      quantity: ''
    })
    this.masterData = [];
   this.totalPrice=0;
  this.NetTotal=0;
  }
  addMasterDatatoObservable(data) {
    this.data.pipe(take(1)).subscribe(val => {
      this.obsArray.next(data);
    })
  }
  openDialog(alert): void {
    const dialogRef = this.dialog.open(PopUpComponent, {
      width: '30em',
      data: {name:alert}
    });
  }
}
