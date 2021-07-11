import { Units } from "./Product";

export interface InvoiceDetails {
    invoiceId: number;
    invoiceDescription:string
    invoiceDate:string,
    totalPrice: number
    freightCharges: number
    loadingCharges: number
    netTotal: number
    productInvoice:ProductInvoice[]
}
export interface ProductInvoice {
    invoiceId: number;
    productInvoiceId:number;
    productId: number;
    productCode:string;
    productDescription:string;
    price: number;
    units:Units;
    quantity: number
}
