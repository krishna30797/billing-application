
import { DatePipe } from '@angular/common';
import { Component, Inject, Injectable, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PopUpComponent } from 'src/app/common/popup/popup.component';
import { InvoiceDetails, ProductInvoice } from "src/app/Model/Invoice";
import { InvoiceDetailsDataService } from "./invoice-details.data.service";

@Component({
    selector: 'app-invoice-details',
    templateUrl: './invoice-details.component.html',
    styleUrls: ['./invoice-details.component.css'],
    providers: [InvoiceDetailsDataService]
})
export class InvoiceDetailsComponent implements OnInit {
    invoiceDetails: InvoiceDetails[];
    searchText;
    invoiceFrom: FormGroup;
    fromDate = new Date();
    toDate = new Date();
    netSales: number = 0;
    displayedColumns: string[] = ['invoiceId', 'invoiceDescription', 'invoiceDate', 'netTotal', 'action'];

    constructor(private invoiceDetailsDataService: InvoiceDetailsDataService,
        private fb: FormBuilder, private datePipe: DatePipe,
        public dialog:MatDialog,private router:Router,private route: ActivatedRoute) {
    }
    ngOnInit(): void {
        this.invoiceFrom = this.fb.group({
            fromDate: this.fromDate,
            toDate: this.toDate
        });
        this.invoiceFrom.valueChanges.subscribe(val => {
            this.fromDate = val.fromDate;
            this.toDate = val.toDate;
            this.GetAllIvoiceDetails(this.fromDate, this.toDate);
        })
        this.GetAllIvoiceDetails(this.fromDate, this.toDate);
    }
    GetAllIvoiceDetails(fromDate: Date, toDate: Date) {
        let fromdate = this.datePipe.transform(fromDate, 'MM-dd-yyyy');
        let todate = this.datePipe.transform(toDate, 'MM-dd-yyyy');
        this.invoiceDetailsDataService.GetAllInvoice(fromdate, todate).then(r => {
            this.invoiceDetails = r
            this.netSales = (+this.invoiceDetails.reduce(function (accumulator, item) {
                return accumulator + item.netTotal;
            }, 0).toFixed(2));
        });
    }
    EditInvoice(invoiceId) {
        this.router.navigate(['../create-invoice'], {
            relativeTo: this.route,
            queryParams: { invoiceId: invoiceId }
          })

    }
    DeleteInvoice(invoiceId) {
        this.invoiceDetailsDataService.DeleteInvoice(invoiceId).then(r => {
            if (r)
            this.openDialog("Deleted Successfully");
                this.GetAllIvoiceDetails(this.fromDate, this.toDate);           
        }
        )
    }
    openDialog(alert): void {
        const dialogRef = this.dialog.open(PopUpComponent, {
          width: '30em',
          data: {name:alert}
        });
      }
}