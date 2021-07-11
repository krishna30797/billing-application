import { Units } from "./Product";

export interface Sales {
    productId: number;
    productCode:string;
    productDescription:string;
    price: number;
    units:Units;
    quantity: number;
    totalSales:number
}
