/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract } from "fabric-contract-api";
import { Movies, RecordType, Status, CanteenInventory } from "./models/Enum";
import { TheatreModel } from "./models/TheatreModel";
import { MovieModel } from "./models/MovieModel";
import { ScreenModel } from "./models/ScreenModel";
import { TicketModel } from "./models/TicketModel";
import moment = require("moment");
import { ShowsModel } from "./models/ShowsModel";

export class ChoneMovieRecords extends Contract {
    
    public async createTheatre(ctx: Context, inputArgs:string) {
        
        let timeStamp = moment().unix();
        let input = JSON.parse(inputArgs);
        let theatreName = input.theatreName;
        let screens: ScreenModel [] = [];
        for(let i=0; i<Movies.NUMBER_OF_SCREENS; i++) {
            screens.push(
                new ScreenModel("Screen"+(i+1), (i+1))
            )
        }
        let windows=[];
        for(let i=0; i<Movies.NUMBER_OF_WINDOWS; i++) {
            windows.push("Window"+(i+1))
        }
        await ctx.stub.putState(
            timeStamp+"",
            Buffer.from(JSON.stringify(
                new TheatreModel(theatreName, timeStamp, RecordType.THEATRE, windows, screens )
            ))
        );
    }
    public async createMovie(ctx: Context, inputArgs:string) {

        let input = JSON.parse(inputArgs);
        let movieID = moment().unix()+"";

        const theatreRaw = await ctx.stub.getState(input.theatreID);
        if (!theatreRaw || theatreRaw.length === 0) {
            throw new Error(`${input.theatreID} does not exist`);
        }
        //console.log(input.theatreID, "--", movieID);
        let indexName = "theatre~movie";
        let shows =[];
        // 
        for(let i=0; i<input.shows.length; i++) {
            shows.push(new ShowsModel(input.shows[i].screenID, input.shows[i].timings))
        }
        
        await ctx.stub.putState(
            movieID, Buffer.from(JSON.stringify(
                new MovieModel(movieID, input.movieTitle, shows, RecordType.MOVIE, 
                    Status.ACTIVE, input.theatreID)
            ))
        )
        

    }
    public async lisofmoviesByTheatreID(ctx: Context, theatreID:string) {
        // let queryString =
        //     '{\r\n   \"selector\": {\r\n      \"documentType\": \"medicalRecord\",\r\n      \"patientID\": \"'+patientID+'\",\r\n      \"status\": \"ACTIVE\"\r\n   },\r\n   \"fields\": [\r\n      \"docCategory\",\r\n      \"documentID\",\r\n      \"uploadedDate\",\r\n      \"uploadedBy\",\r\n      \"uploadedByRole\",\r\n       \"patientID\"\r\n   ]\r\n}';
        let queryString = {
            selector: {
                docType: RecordType.MOVIE,
                theatreID: theatreID,
                status: Status.ACTIVE
            },
            fields: ["movieID", "movieTilte", "shows" ]
        }
        return await this.getResults(ctx,queryString);
    }
    public async lisofmoviesByMovieID(ctx: Context, movieID:string) {
        let queryString = {
            selector: {
                docType: RecordType.MOVIE,
                movieID: movieID,
                status: Status.ACTIVE
            },
            fields: ["movieTilte", "shows", "theatreID"]
        }
        return await this.getResults(ctx,queryString);
    }
    public async lisofmovies(ctx: Context) {
        let queryString = {
            selector: {
                docType: RecordType.MOVIE,
                status: Status.ACTIVE
            },
            fields: ["movieTilte", "shows", "theatreID","movieID" ]
        }
        
        let results= await this.getResults(ctx,queryString);
        
        let movieshows = []
        for(let i=0; i<results.length;i++) {
            let item = results[i];
            let movies = []
            let movieObj = {
                movieTilte: item.movieTilte,
                theatreID: item.theatreID,
                movieID: item.movieID,
                shows: movies
            }
            for(let j=0; j<item.shows.length;j++){
                let show = item.shows[j];
                let timings = [];
                let showObj = {
                    screenID: show.screenID,
                    timings: timings
                }
                for(let k=0; k<show.timings.length; k++) {
                    let time = show.timings[k];
                    let sold = await this.ticketsSold(ctx,item.movieID, item.theatreID, time)
                    let timingObj = {
                        time: time,
                        availability:  Movies.MAX_NUMBER_OF_TICKETS - sold,
                        sold: sold
                    }
                    timings.push(timingObj);
                }
                movies.push(showObj)
            }
            movieshows.push(movieObj);
        }
        return movieshows;

    }
    
    
    public async sellTickets(ctx: Context, inputArgs:string) {
        if(inputArgs.length===0) {
            throw new Error(`Invalid Input Arguments`);
        }
        
        //inptmovieID, theatreID

        let timeStamp = moment().unix();
        let input = JSON.parse(inputArgs);
        
        let movieID = input.movieID;
        let theatreID = input.theatreID;
        let showTime = input.showTime;
        let pos = input.pos;
        let qty = input.qty;
        let screen = input.screen+"";
        let tickNumber = input.number;
        //check tickets availability
        let ticketsAvailability = await this.ticketsAvailability(ctx, movieID, theatreID, showTime, pos);
        let voucher = [];
        for(let i=0; i<qty; i++) {
            voucher.push({
                voucherNumber: moment().unix(),
                redeemedStatus: false
            })
        }
        let ticketsSold = await this.ticketsSold(ctx, movieID, theatreID, showTime);
        if(Movies.MAX_NUMBER_OF_TICKETS === ticketsSold) {
            throw new Error(`Show is Full`);
        }
        await ctx.stub.putState(
            tickNumber, Buffer.from(JSON.stringify(
                new TicketModel(
                    RecordType.TICKET,
                    tickNumber,
                    qty,
                    movieID,
                    screen,
                    showTime,
                    voucher,
                    theatreID,
                    pos
                )
            ))
        );
    }
    public async ticketDetails (ctx: Context, ticketNumber:string) {
        let documentRaw = await (ctx.stub.getState(ticketNumber));
        let document = JSON.parse(documentRaw.toString());
        return document;
    }
    public async ticketsSold (ctx: Context, _movieID:string, _theatreID, _showTime:string) {
        let queryString = {
            selector: {
                docType: RecordType.TICKET,
                movie: _movieID,
                theatreID: _theatreID,
                showTime: _showTime
            }
        }
        let movieDetails = [];
        let totalSold = 0; 
        movieDetails = await this.getResults(ctx,queryString);
       
        movieDetails.forEach(element=>{
            totalSold += parseInt(element.qty);
        });
        return totalSold;
        
    }
    public async canteenInventory (ctx: Context) {
        let _theatreID = "1581229855";
        let queryString = {
            selector: {
                docType: RecordType.TICKET,
                theatreID: _theatreID,
            }
        }
        
        let results= await this.getResults(ctx,queryString);
        let totalSold = 0; 
        let redeemed = [];
        results.forEach(element=>{
            totalSold += parseInt(element.qty);
            element.voucher.forEach(voucher => {
                if(voucher.redeemedStatus === true) {
                    redeemed.push(voucher.voucherNumber);
                }
            });
        });
        
        let availablePopcorns = CanteenInventory.NUMBER_OF_POPCORNS - totalSold ;
        let availableBottles = CanteenInventory.NUMBER_OF_WATER_BOTTLES - totalSold + redeemed.length;
        let availaleSodas = CanteenInventory.NUMBER_OF_SODAS - redeemed.length;
        let resObj = {
            availablePopcorns, availableBottles, availaleSodas
        }
        return resObj;
                
    }
    
    public async redeemVoucher(ctx: Context, inputArgs: string ) {
        let input = JSON.parse(inputArgs);
        let queryString = {
            selector: {
                docType: RecordType.TICKET,
                theatreID: input.theatreID,
                ticketNumber: input.ticketNumber
            }
        }
        let sodas = await this.canteenInventory(ctx);
        if(sodas.availaleSodas === 0) {
            throw new Error(`Sodas out of stock and voucher cant be redeemed`);
        }
        if(parseInt(input.voucherNumber) % 2 !==0) {
            throw new Error(`No Luck! Your voucher cant be redeemed`);
        }
        let results= await this.getResults(ctx,queryString);
        for(let i=0; i<results.length; i++) {
            if(results[i].pos !='Window1') {
                throw new Error(`Only ticketes purchased at window 1 can be redeemed`);
            }
            for(let j=0; j<results[i].voucher.length; j++) {
                
                if(results[i].voucher[j].voucherNumber+"" === input.voucherNumber) {
                    
                    if(results[i].voucher[j].redeemedStatus === true) {
                        throw new Error(`Voucher already redeemed`);
                    }   
                    results[i].voucher[j].redeemedStatus=true
                }
                
            }
            

            await ctx.stub.putState(
                input.ticketNumber, Buffer.from(JSON.stringify(
                    results[i]
                ))
            )
        }

    }
    public async ticketsAvailability(ctx: Context,_movieID, _theatreID, _showTime, _pos) {
        let maxTickets = Movies.MAX_NUMBER_OF_TICKETS;
        //fetch movies
        let queryString = {
            selector: {
                docType: RecordType.MOVIE,
                movieID: _movieID,
                theatreID: _theatreID,
                status: Status.ACTIVE
            },
            fields: ["movieTilte", "shows", "theatreID" ]
        }
        let movieDetails = [] 
        movieDetails = await this.getResults(ctx,queryString);
        if(movieDetails.length === 0) {    
            throw new Error(`Invalid Movie`);
        } 
        let checkTime = false;
        movieDetails[0].shows.forEach(show => {
            show.timings.forEach(showTime => {
                if(showTime === _showTime) {
                    checkTime = true;
                }
            });
        });
        if(checkTime ===false) {
            throw new Error(`Invalid Movie Time`);
        }
        await this.checkPOS(ctx,  _theatreID, _pos);
       
        
    }
    public async checkPOS(ctx: Context, _theatreID, _pos) {
        
        let documentRaw = await (ctx.stub.getState(_theatreID));
        let document = JSON.parse(documentRaw.toString());
        let check = false;
        console.log(_theatreID+"----"+_pos);
        console.log(document);
        for(let i=0; i<document.pos.length; i++) {
            if(_pos===document.pos[i]) {
                check = true;
            }
        }
        if(check===false) {
            throw new Error('Invalid Point of Sale '+_pos);
        }
    }
    
    public async getResults(ctx: Context, queryString:any) {
        
        let iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));

        let allResults = [];
        while (true) {
            let res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString("utf8"));
                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString("utf8"));
                } catch (err) {
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
}
