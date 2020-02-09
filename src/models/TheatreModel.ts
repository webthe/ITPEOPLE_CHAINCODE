import { ScreenModel } from './ScreenModel';
export class TheatreModel {
    public theatreName !: string;
    public theatreID !: number;
    public docType !: string;
    public pos!: [];
    public screens! : ScreenModel[]

    constructor(theatreName: string, theatreID: number, docType: string, pos:any, screens: any ) {
       this.theatreName = theatreName;
       this.theatreID = theatreID;
       this.docType = docType;
       this.pos = pos;
       this.screens = screens;
    }
}