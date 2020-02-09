import { BuyerDetails } from './BuyerDetails';
import { ConsolidatedShipments } from './ConsolidatedShipments';
import { LineItemsModel } from './LineItemsModel';
export declare class POMastermodel {
    docType?: string;
    customerName: string;
    customerSiteName: string;
    poDate: string;
    poNumber: string;
    poCurrentVersion: string;
    poUploadedDate: string;
    poCancelledStatus: string;
    poStatus: string;
    poType: string;
    buyerDetails: BuyerDetails;
    poRefNumber: string;
    revisionStatus: boolean;
    salesOrderNumber: string;
    consolidationStatus: boolean;
    consolidatedShipments: ConsolidatedShipments[];
    lineItems: LineItemsModel[];
}
