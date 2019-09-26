import { BuyerDetails } from './BuyerDetails';
import { ConsolidatedShipments } from './ConsolidatedShipments';

export class PoHeaderModel {
    public docType?: string;
    public customerName: string;
    public customerSiteName: string;
    public poDate: string;
    public poNumber: string;
    public poCurrentVersion: string;
    public poUploadedDate: string;
    public poCancelledStatus: string;
    public poStatus: string;
    public poType: string;
    public buyerDetails: BuyerDetails;
    public poRefNumber: string;
    public revisionStatus: boolean;
    public salesOrderNumber: string;
    public consolidationStatus: boolean;
    public consolidatedShipments: ConsolidatedShipments[];

}
