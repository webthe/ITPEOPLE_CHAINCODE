export class TicketModel {
    public docType !: string;
    public ticketNumber !: string;
    public qty !: number;
    public movie !: string;
    public screen !: string;
    public showTime !: string;
    public voucher !: string[];
    public theatreID !:  string;
    public pos !: string;

    constructor(docType:string, ticketNumber:string, qty:number, movie:string, 
        screen:string, showTime:string, voucher:any, theatreID:string, pos:string) {
            this.docType = docType;
            this.ticketNumber = ticketNumber;
            this.qty = qty;
            this.movie = movie;
            this.screen = screen;
            this.showTime = showTime;
            this.voucher = voucher;
            this.theatreID = theatreID;
            this.pos = pos;
    }
}
