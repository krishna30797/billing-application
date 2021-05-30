
export interface InvoiceDetails {
    invoiceId: number;
    invoiceDescription:string
    invoiceDate:Date,
    totalPrice: number
    freightCharges: number
    loadingCharges: number
    netTotal: number
    productInvoice:ProductInvoice[]
}
export interface ProductInvoice {
    invoiceId: number;
    productId: number;
    productCode:string;
    productDescription:string;
    price: number;
    quantity: number
}
