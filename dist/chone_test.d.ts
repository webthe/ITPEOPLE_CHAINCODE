import { Context, Contract } from "fabric-contract-api";
export declare class ChoneMovieRecords extends Contract {
    createTheatre(ctx: Context, inputArgs: string): Promise<void>;
    createMovie(ctx: Context, inputArgs: string): Promise<void>;
    lisofmoviesByTheatreID(ctx: Context, theatreID: string): Promise<any[]>;
    lisofmoviesByMovieID(ctx: Context, movieID: string): Promise<any[]>;
    lisofmovies(ctx: Context): Promise<any[]>;
    sellTickets(ctx: Context, inputArgs: string): Promise<void>;
    ticketDetails(ctx: Context, ticketNumber: string): Promise<any>;
    ticketsSold(ctx: Context, _movieID: string, _theatreID: any, _showTime: string): Promise<number>;
    canteenInventory(ctx: Context): Promise<{
        availablePopcorns: number;
        availableBottles: number;
        availaleSodas: number;
    }>;
    redeemVoucher(ctx: Context, inputArgs: string): Promise<void>;
    ticketsAvailability(ctx: Context, _movieID: any, _theatreID: any, _showTime: any, _pos: any): Promise<void>;
    checkPOS(ctx: Context, _theatreID: any, _pos: any): Promise<void>;
    getResults(ctx: Context, queryString: any): Promise<any[]>;
}
