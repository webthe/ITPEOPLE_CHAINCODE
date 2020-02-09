import { ShowsModel } from './ShowsModel';
export declare class MovieModel {
    movieID: string;
    movieTilte: string;
    shows: ShowsModel[];
    docType: string;
    status: string;
    theatreID: string;
    constructor(movieID: string, movieTilte: string, shows: any, docType: string, status: string, theatreID: string);
}
