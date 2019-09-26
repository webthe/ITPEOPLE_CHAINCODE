import { Context, Contract } from "fabric-contract-api";
export declare class ChoneMedicalRecords extends Contract {
    documentUpload(ctx: Context, inputArgs: string): Promise<void>;
    fileDuplicateCheck(ctx: Context, mdhash: string, patientID: string): Promise<boolean>;
    listOfDocs(ctx: Context, patientID: string): Promise<any[]>;
    historyForKey(ctx: Context, filekey: string): Promise<any[]>;
    listOfPatientDocsPractioner(ctx: Context, patientID: string, practitionerID: string): Promise<any[]>;
    deleteDocument(ctx: Context, documentID: string, patientID: string, modifiedBy: string, modifiedByRole: string): Promise<void>;
    downloadPermissionCheck(ctx: Context, documentID: string, userID: string, role: string): Promise<{
        fileHash: any;
        access: string;
    }>;
}
