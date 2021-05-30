
import { Component, Inject, Injectable, NgModule, OnInit } from '@angular/core';
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
    displayedColumns: string[] = ['invoiceId', 'invoiceDescription', 'invoiceDate', 'netTotal'];

    constructor(private invoiceDetailsDataService: InvoiceDetailsDataService) {
    }
    ngOnInit(): void {

        this.GetAllIvoiceDetails()
    }
    GetAllIvoiceDetails() {
        this.invoiceDetailsDataService.GetAllInvoice().then(r =>
            this.invoiceDetails = r);
    }
}