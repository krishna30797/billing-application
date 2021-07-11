
import { DatePipe } from '@angular/common';
import { Component, Inject, Injectable, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Sales } from 'src/app/Model/Sales'
import { SalesDataService } from "./sales.data.service";

@Component({
    selector: 'app-sales',
    templateUrl: './sales.component.html',
    styleUrls: ['./sales.component.css'],
    providers: [SalesDataService]
})
export class SalesComponent implements OnInit {
    Sales: Sales[];
    invoiceFrom: FormGroup;
    fromDate = new Date();
    toDate = new Date();
    netSales: number = 0;
    searchText
    displayedColumns: string[] = ['productCode', 'productDescription', 'price', 'quantity','units', 'totalSales'];

    constructor(private SalesDataService: SalesDataService,
        private fb: FormBuilder, private datePipe: DatePipe,private router:Router,private route: ActivatedRoute) {
    }
    ngOnInit(): void {
        this.invoiceFrom = this.fb.group({
            fromDate: this.fromDate,
            toDate: this.toDate
        });
        this.invoiceFrom.valueChanges.subscribe(val => {
            this.fromDate = val.fromDate;
            this.toDate = val.toDate;
            this.GetSalesByDate(this.fromDate, this.toDate);
        })
        this.GetSalesByDate(this.fromDate, this.toDate);
    }
    GetSalesByDate(fromDate: Date, toDate: Date) {
        let fromdate = this.datePipe.transform(fromDate, 'MM-dd-yyyy');
        let todate = this.datePipe.transform(toDate, 'MM-dd-yyyy');
        this.SalesDataService.GetSalesByDate(fromdate, todate).then(r => {
            this.Sales = r
            this.netSales = (+this.Sales.reduce(function (accumulator, item) {
                return accumulator + item.totalSales
            }, 0).toFixed(2));
        });
    }
}