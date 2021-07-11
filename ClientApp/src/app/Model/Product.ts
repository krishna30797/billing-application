
export interface Product {
  id: number;
  productCode: string;
  productDescription: string;
  price: number;
  units: Units
}
export interface ProductSearch {
  id: number,
  name: string
}
export enum Units {
  KGS=1,
  PCS,
}