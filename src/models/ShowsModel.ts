export class ShowsModel {
    public screenID !: number;
    public timings !: string[];

    constructor(screenID : number, timings: string[]) {
        this.screenID = screenID;
        this.timings = timings;
    }
}
