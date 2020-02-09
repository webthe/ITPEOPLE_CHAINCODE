import { ShippingModel } from './ShippingModel';
export declare class LineItemsModel {
    docType?: string;
    poRefNumber: string;
    lineno: string;
    itemName: string;
    lineVersion: string;
    primaryUom: string;
    secondaryUom: string;
    quantity: number;
    shipping: ShippingModel[];
}
