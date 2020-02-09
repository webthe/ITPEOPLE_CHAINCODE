"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//ENUMS
var Movies;
(function (Movies) {
    Movies[Movies["MAX_NUMBER_OF_TICKETS"] = 100] = "MAX_NUMBER_OF_TICKETS";
    Movies[Movies["NUMBER_OF_SCREENS"] = 5] = "NUMBER_OF_SCREENS";
    Movies[Movies["NUMBER_OF_WINDOWS"] = 4] = "NUMBER_OF_WINDOWS";
})(Movies = exports.Movies || (exports.Movies = {}));
var CanteenInventory;
(function (CanteenInventory) {
    CanteenInventory[CanteenInventory["NUMBER_OF_WATER_BOTTLES"] = 500] = "NUMBER_OF_WATER_BOTTLES";
    CanteenInventory[CanteenInventory["NUMBER_OF_POPCORNS"] = 500] = "NUMBER_OF_POPCORNS";
    CanteenInventory[CanteenInventory["NUMBER_OF_SODAS"] = 200] = "NUMBER_OF_SODAS";
})(CanteenInventory = exports.CanteenInventory || (exports.CanteenInventory = {}));
var RecordType;
(function (RecordType) {
    RecordType["MOVIE"] = "movie";
    RecordType["THEATRE"] = "theatre";
    RecordType["TICKET"] = "ticket";
})(RecordType = exports.RecordType || (exports.RecordType = {}));
var Status;
(function (Status) {
    Status["ACTIVE"] = "Active";
    Status["INACTIVE"] = "Inactive";
})(Status = exports.Status || (exports.Status = {}));
//# sourceMappingURL=Enum.js.map