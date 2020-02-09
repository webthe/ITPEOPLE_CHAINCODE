import { ShowsModel } from  './ShowsModel'
export class MovieModel {
    public movieID !: string;
    public movieTilte !: string;
    public shows !: ShowsModel[];
    public docType !: string;
    public status !: string;
    public theatreID !: string

    constructor(movieID:string, movieTilte:string, shows:any, docType:string, status:string, theatreID: string) {
        this.movieID = movieID;
        this.movieTilte = movieTilte;
        this.shows = shows;
        this.docType = docType;
        this.status = status;
        this.theatreID = theatreID;
    }
}