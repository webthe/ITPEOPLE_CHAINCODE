export class ScreenModel {
    public screenName !: string;
    public screenID !: any;

    constructor(screenName: string, screenID: any) {
        this.screenName = screenName;
        this.screenID = screenID;
    }
}