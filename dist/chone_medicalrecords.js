"use strict";
/*
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_contract_api_1 = require("fabric-contract-api");
const moment = require("moment");
class ChoneMedicalRecords extends fabric_contract_api_1.Contract {
    async documentUpload(ctx, inputArgs) {
        let medicalRecord = JSON.parse(inputArgs);
        let docKey = medicalRecord.documentID;
        let timeStamp = moment().unix();
        console.log("+++++++++++++++++++++" + timeStamp);
        if (medicalRecord.uploadedByRole === "Practitioner") {
            let permKey = "H" + medicalRecord.documentID;
            let permissionsObj = {
                documentID: docKey,
                patientID: medicalRecord.patientID,
                practitionerID: medicalRecord.uploadedBy,
                accessStatus: "OPEN",
                createdDate: timeStamp,
                modifiedDate: timeStamp,
                documentType: "history"
            };
            await ctx.stub.putState(permKey, Buffer.from(JSON.stringify(permissionsObj)));
        }
        await ctx.stub.putState(docKey, Buffer.from(JSON.stringify(medicalRecord)));
    }
    async fileDuplicateCheck(ctx, mdhash, patientID) {
        let queryString = '{\r\n   \"selector\": {\r\n      \"documentType\": \"medicalRecord\",\r\n      \"mdhash\": \"' + mdhash + '\",\r\n      \"patientID\": \"' + patientID + '\",\r\n      \"status\": \"ACTIVE\"\r\n   }\r\n}';
        let iterator = await ctx.stub.getQueryResult(queryString);
        let allResults = [];
        while (true) {
            let res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString("utf8"));
                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString("utf8"));
                }
                catch (err) {
                    console.log(err);
                    Record = res.value.value.toString("utf8");
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                await iterator.close();
                console.info(allResults);
                let fileExists = (allResults.length > 0) ? true : false;
                return fileExists;
            }
        }
    }
    async listOfDocs(ctx, patientID) {
        let queryString = '{\r\n   \"selector\": {\r\n      \"documentType\": \"medicalRecord\",\r\n      \"patientID\": \"' + patientID + '\",\r\n      \"status\": \"ACTIVE\"\r\n   },\r\n   \"fields\": [\r\n      \"docCategory\",\r\n      \"documentID\",\r\n      \"uploadedDate\",\r\n      \"uploadedBy\",\r\n      \"uploadedByRole\",\r\n       \"patientID\"\r\n   ]\r\n}';
        let iterator = await ctx.stub.getQueryResult(queryString);
        let allResults = [];
        while (true) {
            let res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString("utf8"));
                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString("utf8"));
                }
                catch (err) {
                    console.log(err);
                    Record = res.value.value.toString("utf8");
                }
                allResults.push(Record);
            }
            if (res.done) {
                await iterator.close();
                console.info(allResults);
                return allResults;
            }
        }
    }
    async historyForKey(ctx, filekey) {
        console.log("=========================" + filekey);
        let iterator = await ctx.stub.getHistoryForKey(filekey);
        let allResults = [];
        while (true) {
            let res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString("utf8"));
                //const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString("utf8"));
                }
                catch (err) {
                    console.log(err);
                    Record = res.value.value.toString("utf8");
                }
                allResults.push(Record);
            }
            if (res.done) {
                await iterator.close();
                console.info(allResults);
                return allResults;
            }
        }
    }
    async listOfPatientDocsPractioner(ctx, patientID, practitionerID) {
        try {
            let patientDocs = [];
            let files = [];
            console.log("HI");
            patientDocs = await this.listOfDocs(ctx, patientID);
            console.log("patientDocs " + patientDocs);
            patientDocs.forEach((items) => {
                files.push(items.documentID);
            });
            let permissions = [];
            for (let i = 0; i < files.length; i++) {
                let fileKey = "H" + files[i];
                let historyForKey = [];
                historyForKey = await this.historyForKey(ctx, fileKey);
                console.info(historyForKey);
                historyForKey.forEach(async (keyItem) => {
                    if (keyItem.practitionerID.toString() === practitionerID) {
                        permissions.push(keyItem);
                    }
                });
            }
            const index = patientDocs.findIndex(x => x.practitionerID === practitionerID);
            if (index !== undefined)
                patientDocs.splice(index, 1);
            patientDocs.forEach((items, i) => {
                let fileHistory = [];
                permissions.forEach((file) => {
                    if (items.documentID === file.documentID) {
                        fileHistory.push(file);
                    }
                });
                items.history = fileHistory;
            });
            return patientDocs;
        }
        catch (error) {
        }
    }
    async deleteDocument(ctx, documentID, patientID, modifiedBy, modifiedByRole) {
        let documentRaw = await (ctx.stub.getState(documentID));
        let document = JSON.parse(documentRaw.toString());
        console.log("============" + document);
        if (patientID === document.patientID) {
            document.status = "INACTIVE";
            document.modifiedBy = modifiedBy;
            document.modifiedByRole = modifiedByRole;
            document.modifiedDate = moment().format("YYYY-MM-DD");
            await ctx.stub.putState(documentID, Buffer.from(JSON.stringify(document)));
        }
        else {
            throw new Error('Invalid Patient ID');
        }
    }
    async downloadPermissionCheck(ctx, documentID, userID, role) {
        let documentRaw = await (ctx.stub.getState(documentID));
        if (documentRaw.length == 0) {
            throw new Error('Invalid Document ID');
        }
        let document = JSON.parse(documentRaw.toString());
        if (document.status === "INACTIVE") {
            throw new Error("Invalid Document ID");
        }
        let documentPermissions = await this.historyForKey(ctx, "H" + documentID);
        let access;
        if (role === 'Patient') {
            if (document.patientID === userID) {
                access = "OPEN";
            }
            access = "CLOSE";
        }
        else if (role === 'Practitioner') {
            let permissions = [];
            documentPermissions.forEach(file => {
                if (file.practitionerID.toString() === userID) {
                    permissions.push(file);
                }
            });
            permissions.sort((a, b) => {
                return b.modifiedDate - a.modifiedDatse;
            });
            access = permissions[0].accessStatus;
        }
        let resultObj = {
            fileHash: document.filehash,
            access: access
        };
        return resultObj;
    }
}
exports.ChoneMedicalRecords = ChoneMedicalRecords;
//# sourceMappingURL=chone_medicalrecords.js.map