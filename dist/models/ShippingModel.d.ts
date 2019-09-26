import { ReferenceModel } from './ReferenceModel';
import { BillOfLadingModel } from './BillOfLadingModel';
export declare class ShippingModel {
    shipmentVersion: string;
    shipmentNumber: number;
    quantity: number;
    primaryUom: string;
    secondaryUom: string;
    needByDate: Date;
    shippedByself: string;
    references: ReferenceModel[];
    mrpRequisition: string;
    billofLadingNumber: BillOfLadingModel[];
    shiptoLocation: string;
    shipmentTrackingNumber: string;
    shippingLine: string;
    vessel: string;
    portOfDeparture: string;
    portOfArrival: string;
    SCAC: string;
    IncoTerms: string;
    consolidationStatus: boolean;
    shipmentReference: string;
    plannedShipmentDate: Date;
    actualShipmentDate: Date;
}
