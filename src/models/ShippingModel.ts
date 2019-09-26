import { ReferenceModel } from './ReferenceModel'
import { BillOfLadingModel } from './BillOfLadingModel'

export class ShippingModel {
    public shipmentVersion: string;
    public shipmentNumber: number;
    public quantity: number;
    public primaryUom: string;
    public secondaryUom: string;
    public needByDate: Date;
    public shippedByself: string;
    public references: ReferenceModel[];
    public mrpRequisition: string;
    public billofLadingNumber: BillOfLadingModel[];
    public shiptoLocation: string;
    public shipmentTrackingNumber: string;
    public shippingLine: string;
    public vessel: string;
    public portOfDeparture: string;
    public portOfArrival: string;
    public SCAC: string;
    public IncoTerms: string;
    public consolidationStatus: boolean;
    public shipmentReference: string;
    public plannedShipmentDate: Date;
    public actualShipmentDate: Date 
}
