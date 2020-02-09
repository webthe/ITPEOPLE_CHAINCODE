import { ScreenModel } from './ScreenModel';
export declare class TheatreModel {
    theatreName: string;
    theatreID: number;
    docType: string;
    pos: [];
    screens: ScreenModel[];
    constructor(theatreName: string, theatreID: number, docType: string, pos: any, screens: any);
}
