import { ShippingModel } from './ShippingModel';

export class LineItemsModel {
    public docType?: string;
    public poRefNumber: string; //Used to refer POHeader
    public lineno: string;
    public itemName: string;
    public lineVersion: string;
    public primaryUom: string;
    public secondaryUom: string;
    public quantity: number;
    public shipping: ShippingModel[];
}

